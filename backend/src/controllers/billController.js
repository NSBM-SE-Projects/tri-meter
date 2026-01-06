import { getPool } from '../config/database.js';
import sql from 'mssql';

// GET /api/bills
export const getAllBills = async (req, res) => {
  try {
    const { status, utilityType, search } = req.query;
    const pool = await getPool();

    let query = `
      SELECT
        b.B_ID as id,
        b.B_Date as issueDate,
        b.B_DueDate as dueDate,
        b.B_TotalAmount as totalAmount,
        b.B_Status as status,
        b.B_PeriodStart as billingPeriodStart,
        b.B_PeriodEnd as billingPeriodEnd,
        b.B_Consumption as consumption,
        c.C_ID as customerId,
        c.C_Name as customerName,
        c.C_Email as customerEmail,
        m.M_Number as meterNumber,
        u.Ut_Name as utilityType,
        u.Ut_Unit as unit
      FROM Bill b
      INNER JOIN Customer c ON b.C_ID = c.C_ID
      INNER JOIN Meter m ON b.M_ID = m.M_ID
      INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
      WHERE 1=1
    `;

    const request = pool.request();

    // Add filters
    if (status && status !== 'all') {
      query += ` AND b.B_Status = @status`;
      request.input('status', sql.VarChar(20), status);
    }

    if (utilityType && utilityType !== 'all') {
      query += ` AND u.Ut_Name = @utilityType`;
      request.input('utilityType', sql.VarChar(50), utilityType);
    }

    if (search) {
      query += ` AND (c.C_Name LIKE @search OR m.M_Number LIKE @search)`;
      request.input('search', sql.VarChar(100), `%${search}%`);
    }

    query += ` ORDER BY b.B_Date DESC`;

    const result = await request.query(query);

    // Format the data for frontend
    const bills = result.recordset.map(bill => ({
      id: bill.id,
      billId: `B-${String(bill.id).padStart(3, '0')}`,
      name: bill.customerName,
      customerId: `#CUST-${String(bill.customerId).padStart(3, '0')}`,
      utility: bill.utilityType,
      period: formatBillingPeriod(bill.billingPeriodStart, bill.billingPeriodEnd),
      consumption: bill.consumption,
      unit: bill.unit,
      amount: `$${bill.totalAmount.toFixed(2)}`,
      dueDate: formatDate(bill.dueDate),
      status: bill.status
    }));

    res.status(200).json({
      success: true,
      data: bills
    });

  } catch (error) {
    console.error('GET ALL BILLS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/bills/:id
 * Get bill by ID with full details including line items
 */
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    // Remove B- prefix if present
    const billId = id.replace('B-', '');

    const pool = await getPool();

    // Get bill details
    const billResult = await pool.request()
      .input('billId', sql.Int, billId)
      .query(`
        SELECT
          b.B_ID as id,
          b.B_Date as issueDate,
          b.B_DueDate as dueDate,
          b.B_TotalAmount as totalAmount,
          b.B_Status as status,
          b.B_PeriodStart as billingPeriodStart,
          b.B_PeriodEnd as billingPeriodEnd,
          b.B_Consumption as consumption,
          b.B_ConsumptionCharge as consumptionCharge,
          b.B_FixedCharges as fixedCharges,
          b.B_LateFee as lateFee,
          b.B_PreviousBalance as previousBalance,
          c.C_ID as customerId,
          c.C_Name as customerName,
          c.C_Email as customerEmail,
          CONCAT_WS(', ', a.A_HouseNo, a.A_Street, a.A_City) as customerAddress,
          m.M_Number as meterNumber,
          u.Ut_Name as utilityType,
          u.Ut_Unit as unit
        FROM Bill b
        INNER JOIN Customer c ON b.C_ID = c.C_ID
        INNER JOIN Meter m ON b.M_ID = m.M_ID
        INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
        LEFT JOIN Address a ON c.A_ID = a.A_ID
        WHERE b.B_ID = @billId
      `);

    if (billResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    const bill = billResult.recordset[0];

    // Get meter readings for this billing period
    const readingsResult = await pool.request()
      .input('meterId', sql.Int, bill.id) // Using bill.id as we need to map back to meter
      .input('periodStart', sql.Date, bill.billingPeriodStart)
      .input('periodEnd', sql.Date, bill.billingPeriodEnd)
      .query(`
        SELECT TOP 2
          R_Value as ReadingValue,
          R_Date as ReadingDate
        FROM MeterReading
        WHERE M_ID = (SELECT M_ID FROM Bill WHERE B_ID = @meterId)
          AND R_Date BETWEEN @periodStart AND @periodEnd
        ORDER BY R_Date ASC
      `);

    let previousReading = 0;
    let currentReading = 0;

    if (readingsResult.recordset.length >= 2) {
      previousReading = readingsResult.recordset[0].ReadingValue;
      currentReading = readingsResult.recordset[1].ReadingValue;
    } else if (readingsResult.recordset.length === 1) {
      // If only one reading, estimate the other from consumption
      currentReading = readingsResult.recordset[0].ReadingValue;
      previousReading = currentReading - bill.consumption;
    } else {
      // No readings found, create estimates from consumption
      previousReading = 0;
      currentReading = bill.consumption;
    }

    // Get bill line items
    const lineItemsResult = await pool.request()
      .input('billId', sql.Int, billId)
      .query(`
        SELECT
          Bl_LineNumber as lineNumber,
          Bl_Description as description,
          Bl_Quantity as quantity,
          Bl_Rate as rate,
          Bl_Amount as amount
        FROM BillLineItem
        WHERE B_ID = @billId
        ORDER BY Bl_LineNumber
      `);

    // Build charges array
    const charges = [];

    // Add line items first (these contain detailed breakdown)
    lineItemsResult.recordset.forEach(item => {
      charges.push({
        description: item.description,
        amount: item.amount
      });
    });

    // Add late fee
    if (bill.lateFee > 0) {
      charges.push({
        description: 'Late Fee',
        amount: bill.lateFee
      });
    }

    // Add previous balance
    if (bill.previousBalance > 0) {
      charges.push({
        description: 'Previous Balance',
        amount: bill.previousBalance
      });
    }

    const billData = {
      billId: `B-${String(bill.id).padStart(3, '0')}`,
      customerName: bill.customerName,
      customerId: `#CUST-${String(bill.customerId).padStart(3, '0')}`,
      customerEmail: bill.customerEmail,
      customerAddress: bill.customerAddress || 'N/A',
      utility: bill.utilityType,
      meter: bill.meterNumber,
      billingPeriod: `${formatDate(bill.billingPeriodStart)} - ${formatDate(bill.billingPeriodEnd)}`,
      previousReading: previousReading,
      currentReading: currentReading,
      consumption: bill.consumption,
      unit: bill.unit,
      charges: charges,
      totalAmount: bill.totalAmount,
      dueDate: formatDate(bill.dueDate),
      issueDate: formatDate(bill.issueDate),
      status: bill.status
    };

    res.status(200).json({
      success: true,
      data: billData
    });

  } catch (error) {
    console.error('GET BILL BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/bills
 * Generate a new bill from service connection
 */
export const generateBill = async (req, res) => {
  try {
    const {
      customerId,
      serviceConnectionId,
      periodFrom,
      periodTo
    } = req.body;

    // Validation
    if (!customerId || !serviceConnectionId || !periodFrom || !periodTo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerId, serviceConnectionId, periodFrom, periodTo'
      });
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // 1. Get service connection, meter, and tariff details
      const scResult = await transaction.request()
        .input('serviceConnectionId', sql.Int, serviceConnectionId)
        .query(`
          SELECT
            sc.S_ID,
            sc.C_ID,
            sc.M_ID,
            m.Ut_ID,
            sc.T_ID,
            sc.S_InstallationCharge,
            u.Ut_Name,
            u.Ut_Unit
          FROM ServiceConnection sc
          INNER JOIN Meter m ON sc.M_ID = m.M_ID
          INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
          WHERE sc.S_ID = @serviceConnectionId
        `);

      if (scResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Service connection not found'
        });
      }

      const sc = scResult.recordset[0];

      // 2. Get the two most recent meter readings within the period
      const readingsResult = await transaction.request()
        .input('meterId', sql.Int, sc.M_ID)
        .input('periodFrom', sql.Date, periodFrom)
        .input('periodTo', sql.Date, periodTo)
        .query(`
          SELECT TOP 2
            R_ID,
            R_Value as ReadingValue,
            R_Date as ReadingDate
          FROM MeterReading
          WHERE M_ID = @meterId
            AND R_Date BETWEEN @periodFrom AND @periodTo
          ORDER BY R_Date ASC
        `);

      let consumption = 0;
      let previousReading = null;
      let currentReading = null;

      if (readingsResult.recordset.length >= 2) {
        previousReading = readingsResult.recordset[0].ReadingValue;
        currentReading = readingsResult.recordset[1].ReadingValue;
        consumption = currentReading - previousReading;
      } else {
        // If no meter readings, use a default consumption of 0
        consumption = 0;
      }

      // 3. Calculate charges based on tariff
      let consumptionCharge = 0;
      let fixedCharges = 0;

      // Get tariff rates based on utility type
      if (sc.Ut_Name === 'Electricity') {
        const tariffResult = await transaction.request()
          .input('tariffId', sql.Int, sc.T_ID)
          .query(`
            SELECT E_Slab1Max, E_Slab1Rate, E_Slab2Max, E_Slab2Rate, E_Slab3Rate
            FROM ElectricityTariff
            WHERE E_T_ID = @tariffId
          `);

        if (tariffResult.recordset.length > 0) {
          const tariff = tariffResult.recordset[0];
          // Slab-based calculation
          if (consumption <= tariff.E_Slab1Max) {
            consumptionCharge = consumption * tariff.E_Slab1Rate;
          } else if (consumption <= tariff.E_Slab2Max) {
            consumptionCharge = (tariff.E_Slab1Max * tariff.E_Slab1Rate) +
              ((consumption - tariff.E_Slab1Max) * tariff.E_Slab2Rate);
          } else {
            consumptionCharge = (tariff.E_Slab1Max * tariff.E_Slab1Rate) +
              ((tariff.E_Slab2Max - tariff.E_Slab1Max) * tariff.E_Slab2Rate) +
              ((consumption - tariff.E_Slab2Max) * tariff.E_Slab3Rate);
          }
        }
      } else if (sc.Ut_Name === 'Water') {
        const tariffResult = await transaction.request()
          .input('tariffId', sql.Int, sc.T_ID)
          .query(`
            SELECT W_FlatRate, W_FixedCharge
            FROM WaterTariff
            WHERE W_T_ID = @tariffId
          `);

        if (tariffResult.recordset.length > 0) {
          const tariff = tariffResult.recordset[0];
          consumptionCharge = consumption * tariff.W_FlatRate;
          fixedCharges = tariff.W_FixedCharge;
        }
      } else if (sc.Ut_Name === 'Gas') {
        const tariffResult = await transaction.request()
          .input('tariffId', sql.Int, sc.T_ID)
          .query(`
            SELECT G_Slab1Max, G_Slab1Rate, G_Slab2Rate, G_SubsidyAmount
            FROM GasTariff
            WHERE G_T_ID = @tariffId
          `);

        if (tariffResult.recordset.length > 0) {
          const tariff = tariffResult.recordset[0];
          // Slab-based calculation
          if (consumption <= tariff.G_Slab1Max) {
            consumptionCharge = consumption * tariff.G_Slab1Rate;
          } else {
            consumptionCharge = (tariff.G_Slab1Max * tariff.G_Slab1Rate) +
              ((consumption - tariff.G_Slab1Max) * tariff.G_Slab2Rate);
          }
          // Apply subsidy for household customers
          const customerTypeResult = await transaction.request()
            .input('customerId', sql.Int, customerId)
            .query(`SELECT C_Type FROM Customer WHERE C_ID = @customerId`);
          if (customerTypeResult.recordset[0]?.C_Type === 'Household') {
            consumptionCharge = Math.max(0, consumptionCharge - tariff.G_SubsidyAmount);
          }
        }
      }

      // 4. Get previous balance (last unpaid bill for this service connection)
      const previousBalanceResult = await transaction.request()
        .input('serviceConnectionId', sql.Int, serviceConnectionId)
        .query(`
          SELECT TOP 1 B_TotalAmount
          FROM Bill
          WHERE M_ID = @serviceConnectionId
            AND B_Status = 'Unpaid'
          ORDER BY B_Date DESC
        `);

      const previousBalance = previousBalanceResult.recordset.length > 0
        ? previousBalanceResult.recordset[0].B_TotalAmount
        : 0;

      const lateFee = 0; // No late fee for new bills
      const totalAmount = consumptionCharge + fixedCharges + previousBalance + lateFee;

      // 5. Create bill
      const billResult = await transaction.request()
        .input('customerId', sql.Int, customerId)
        .input('meterId', sql.Int, sc.M_ID)
        .input('tariffId', sql.Int, sc.T_ID || 1) // Default to 1 if no tariff found
        .input('periodStart', sql.Date, periodFrom)
        .input('periodEnd', sql.Date, periodTo)
        .input('consumption', sql.Decimal(10, 2), consumption)
        .input('consumptionCharge', sql.Decimal(10, 2), consumptionCharge)
        .input('fixedCharges', sql.Decimal(10, 2), fixedCharges)
        .input('lateFee', sql.Decimal(10, 2), lateFee)
        .input('previousBalance', sql.Decimal(10, 2), previousBalance)
        .input('totalAmount', sql.Decimal(10, 2), totalAmount)
        .input('issueDate', sql.Date, new Date())
        .input('dueDate', sql.Date, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // 30 days from now
        .input('status', sql.VarChar(20), 'Unpaid')
        .query(`
          INSERT INTO Bill (
            C_ID, M_ID, T_ID, B_PeriodStart, B_PeriodEnd,
            B_Consumption, B_ConsumptionCharge, B_FixedCharges,
            B_LateFee, B_PreviousBalance, B_TotalAmount,
            B_Date, B_DueDate, B_Status
          )
          OUTPUT INSERTED.B_ID
          VALUES (
            @customerId, @meterId, @tariffId, @periodStart, @periodEnd,
            @consumption, @consumptionCharge, @fixedCharges,
            @lateFee, @previousBalance, @totalAmount,
            @issueDate, @dueDate, @status
          )
        `);

      const billId = billResult.recordset[0].B_ID;

      // 6. Create BillLineItems for detailed breakdown
      let lineNumber = 1;

      // Add consumption charge line item
      if (consumptionCharge > 0) {
        await transaction.request()
          .input('billId', sql.Int, billId)
          .input('lineNumber', sql.Int, lineNumber++)
          .input('description', sql.VarChar(255), `${sc.Ut_Name} Consumption`)
          .input('quantity', sql.Decimal(10, 2), consumption)
          .input('rate', sql.Decimal(10, 2), consumption > 0 ? consumptionCharge / consumption : 0)
          .input('amount', sql.Decimal(10, 2), consumptionCharge)
          .query(`
            INSERT INTO BillLineItem (B_ID, Bl_LineNumber, Bl_Description, Bl_Quantity, Bl_Rate, Bl_Amount)
            VALUES (@billId, @lineNumber, @description, @quantity, @rate, @amount)
          `);
      }

      // Add fixed charge line item (for water)
      if (fixedCharges > 0) {
        await transaction.request()
          .input('billId', sql.Int, billId)
          .input('lineNumber', sql.Int, lineNumber++)
          .input('description', sql.VarChar(255), 'Fixed Charge')
          .input('quantity', sql.Decimal(10, 2), 1)
          .input('rate', sql.Decimal(10, 2), fixedCharges)
          .input('amount', sql.Decimal(10, 2), fixedCharges)
          .query(`
            INSERT INTO BillLineItem (B_ID, Bl_LineNumber, Bl_Description, Bl_Quantity, Bl_Rate, Bl_Amount)
            VALUES (@billId, @lineNumber, @description, @quantity, @rate, @amount)
          `);
      }

      // Check if this is the first bill for this service connection (add installation charge)
      const billCountResult = await transaction.request()
        .input('meterId', sql.Int, sc.M_ID)
        .query(`SELECT COUNT(*) as billCount FROM Bill WHERE M_ID = @meterId`);

      if (billCountResult.recordset[0].billCount === 1) {
        // This is the first bill, add installation charge
        await transaction.request()
          .input('billId', sql.Int, billId)
          .input('lineNumber', sql.Int, lineNumber++)
          .input('description', sql.VarChar(255), 'Installation Charge')
          .input('quantity', sql.Decimal(10, 2), 1)
          .input('rate', sql.Decimal(10, 2), sc.S_InstallationCharge || 0)
          .input('amount', sql.Decimal(10, 2), sc.S_InstallationCharge || 0)
          .query(`
            INSERT INTO BillLineItem (B_ID, Bl_LineNumber, Bl_Description, Bl_Quantity, Bl_Rate, Bl_Amount)
            VALUES (@billId, @lineNumber, @description, @quantity, @rate, @amount)
          `);

        // Update total amount to include installation charge
        await transaction.request()
          .input('billId', sql.Int, billId)
          .input('installationCharge', sql.Decimal(10, 2), sc.S_InstallationCharge || 0)
          .query(`
            UPDATE Bill
            SET B_TotalAmount = B_TotalAmount + @installationCharge
            WHERE B_ID = @billId
          `);
      }

      await transaction.commit();

      // Fetch the created bill
      const newBill = await pool.request()
        .input('billId', sql.Int, billId)
        .query(`
          SELECT
            b.B_ID as id,
            b.B_Date as issueDate,
            b.B_DueDate as dueDate,
            b.B_TotalAmount as totalAmount,
            b.B_Status as status,
            b.B_PeriodStart as billingPeriodStart,
            b.B_PeriodEnd as billingPeriodEnd,
            b.B_Consumption as consumption,
            c.C_ID as customerId,
            c.C_Name as customerName,
            u.Ut_Name as utilityType,
            u.Ut_Unit as unit,
            m.M_Number as meterNumber
          FROM Bill b
          INNER JOIN Customer c ON b.C_ID = c.C_ID
          INNER JOIN Meter m ON b.M_ID = m.M_ID
          INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
          WHERE b.B_ID = @billId
        `);

      const bill = newBill.recordset[0];

      res.status(201).json({
        success: true,
        message: 'Bill generated successfully',
        data: {
          billId: `B-${String(bill.id).padStart(3, '0')}`,
          customerName: bill.customerName,
          customerId: `#CUST-${String(bill.customerId).padStart(3, '0')}`,
          utility: bill.utilityType,
          meter: bill.meterNumber,
          billingPeriod: `${formatDate(bill.billingPeriodStart)} - ${formatDate(bill.billingPeriodEnd)}`,
          consumption: bill.consumption,
          unit: bill.unit,
          totalAmount: bill.totalAmount,
          dueDate: formatDate(bill.dueDate),
          status: bill.status
        }
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('GENERATE BILL ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate bill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/bills/:id/send-email
 * Send bill via email
 */
export const sendBillEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const billId = id.replace('B-', '');

    const pool = await getPool();

    // Get bill details with customer email
    const billResult = await pool.request()
      .input('billId', sql.Int, billId)
      .query(`
        SELECT
          b.B_ID as id,
          b.B_TotalAmount as totalAmount,
          b.B_DueDate as dueDate,
          c.C_Name as customerName,
          c.C_Email as customerEmail,
          u.Ut_Name as utilityType
        FROM Bill b
        INNER JOIN Customer c ON b.C_ID = c.C_ID
        INNER JOIN Meter m ON b.M_ID = m.M_ID
        INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
        WHERE b.B_ID = @billId
      `);

    if (billResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    const bill = billResult.recordset[0];

    if (!bill.customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Customer email not found'
      });
    }

    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // For now, we'll simulate sending the email
    console.log('=== SENDING BILL EMAIL ===');
    console.log(`To: ${bill.customerEmail}`);
    console.log(`Subject: Bill ${String(bill.id).padStart(3, '0')} - ${bill.utilityType}`);
    console.log(`Bill ID: B-${String(bill.id).padStart(3, '0')}`);
    console.log(`Customer: ${bill.customerName}`);
    console.log(`Amount: $${bill.totalAmount}`);
    console.log(`Due Date: ${formatDate(bill.dueDate)}`);
    console.log('========================');

    // In production, you would send actual email here:
    /*
    await sendEmail({
      to: bill.customerEmail,
      subject: `Your ${bill.utilityType} Bill - B-${String(bill.id).padStart(3, '0')}`,
      html: generateBillEmailTemplate(bill)
    });
    */

    res.status(200).json({
      success: true,
      message: `Bill sent to ${bill.customerEmail}`
    });

  } catch (error) {
    console.error('SEND BILL EMAIL ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bill email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/bills/customers
 * Get all active customers for bill generation
 */
export const getCustomersForBilling = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        C_ID as id,
        C_Name as name,
        C_Email as email
      FROM Customer
      WHERE C_Status = 'Active'
      ORDER BY C_Name
    `);

    const customers = result.recordset.map(c => ({
      id: c.id,
      name: c.name,
      customerId: `#CUST-${String(c.id).padStart(3, '0')}`,
      email: c.email
    }));

    res.status(200).json({
      success: true,
      data: customers
    });

  } catch (error) {
    console.error('GET CUSTOMERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/bills/service-connections/:customerId
 * Get service connections for a specific customer
 */
export const getServiceConnectionsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const pool = await getPool();

    const result = await pool.request()
      .input('customerId', sql.Int, customerId)
      .query(`
        SELECT
          sc.S_ID as id,
          sc.C_ID as customerId,
          sc.M_ID as meterId,
          m.M_Number as meterNumber,
          u.Ut_Name as utilityType,
          u.Ut_Unit as unit,
          c.C_Name as customerName
        FROM ServiceConnection sc
        INNER JOIN Meter m ON sc.M_ID = m.M_ID
        INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        WHERE sc.C_ID = @customerId
          AND sc.S_Status = 'Active'
        ORDER BY u.Ut_Name, m.M_Number
      `);

    const connections = result.recordset.map(sc => ({
      id: sc.id,
      meter: sc.meterNumber,
      customer: sc.customerName,
      utility: sc.utilityType,
      customerId: sc.customerId,
      meterId: sc.meterId
    }));

    res.status(200).json({
      success: true,
      data: connections
    });

  } catch (error) {
    console.error('GET SERVICE CONNECTIONS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service connections',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function formatBillingPeriod(startDate, endDate) {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[start.getMonth()]} ${start.getFullYear()}`;
}
