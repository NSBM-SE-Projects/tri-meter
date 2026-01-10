import { getPool } from '../config/database.js';
import sql from 'mssql';

// Helper function to format date
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// GET /api/payments - Get all payments with optional filters
export const getAllPayments = async (req, res) => {
  try {
    const { search, method, dateFrom, dateTo } = req.query;
    const pool = await getPool();

    let query = `
      SELECT
        p.P_ID as id,
        p.B_ID as billId,
        p.P_Amount as amount,
        p.P_Method as method,
        p.P_ReferenceNo as referenceNo,
        p.P_Date as paymentDate,
        c.C_ID as customerId,
        c.C_Name as customerName,
        u.U_FullName as cashierName,
        b.B_TotalAmount as billAmount,
        b.B_Status as billStatus
      FROM Payment p
      INNER JOIN Bill b ON p.B_ID = b.B_ID
      INNER JOIN Customer c ON b.C_ID = c.C_ID
      INNER JOIN [User] u ON p.U_ID = u.U_ID
      WHERE 1=1
    `;

    const request = pool.request();

    // Add filters
    if (search) {
      query += ` AND (c.C_Name LIKE @search OR b.B_ID LIKE @search OR p.P_ReferenceNo LIKE @search)`;
      request.input('search', sql.VarChar(100), `%${search}%`);
    }

    if (method && method !== 'all') {
      query += ` AND p.P_Method = @method`;
      request.input('method', sql.VarChar(20), method);
    }

    if (dateFrom) {
      query += ` AND p.P_Date >= @dateFrom`;
      request.input('dateFrom', sql.Date, new Date(dateFrom));
    }

    if (dateTo) {
      query += ` AND p.P_Date <= @dateTo`;
      request.input('dateTo', sql.Date, new Date(dateTo));
    }

    query += ` ORDER BY p.P_Date DESC`;

    const result = await request.query(query);

    // Format data for frontend
    const payments = result.recordset.map(payment => ({
      id: payment.id,
      paymentId: `P-${String(payment.id)}`,
      billId: `B-${String(payment.billId)}`,
      customerName: payment.customerName,
      amount: `$${payment.amount.toFixed(2)}`,
      method: payment.method,
      referenceNo: payment.referenceNo || '-',
      paymentDate: formatDate(payment.paymentDate),
      cashierName: payment.cashierName,
      billStatus: payment.billStatus
    }));

    res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('GET ALL PAYMENTS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/payments/:id - Get single payment details
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getPool();

    const result = await pool.request()
      .input('paymentId', sql.Int, id)
      .query(`
        SELECT
          p.P_ID as id,
          p.B_ID as billId,
          p.P_Amount as amount,
          p.P_Method as method,
          p.P_ReferenceNo as referenceNo,
          p.P_Date as paymentDate,
          c.C_ID as customerId,
          c.C_Name as customerName,
          c.C_Email as customerEmail,
          u.U_FullName as cashierName,
          b.B_TotalAmount as billAmount,
          b.B_Status as billStatus,
          b.B_PeriodStart as billingPeriodStart,
          b.B_PeriodEnd as billingPeriodEnd
        FROM Payment p
        INNER JOIN Bill b ON p.B_ID = b.B_ID
        INNER JOIN Customer c ON b.C_ID = c.C_ID
        INNER JOIN [User] u ON p.U_ID = u.U_ID
        WHERE p.P_ID = @paymentId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = result.recordset[0];

    const paymentData = {
      id: payment.id,
      paymentId: `P-${String(payment.id).padStart(6, '0')}`,
      billId: `B-${String(payment.billId).padStart(6, '0')}`,
      customerName: payment.customerName,
      customerEmail: payment.customerEmail,
      amount: payment.amount,
      method: payment.method,
      referenceNo: payment.referenceNo || '-',
      paymentDate: formatDate(payment.paymentDate),
      cashierName: payment.cashierName,
      billAmount: payment.billAmount,
      billStatus: payment.billStatus,
      billingPeriod: `${formatDate(payment.billingPeriodStart)} - ${formatDate(payment.billingPeriodEnd)}`
    };

    res.status(200).json({
      success: true,
      data: paymentData
    });

  } catch (error) {
    console.error('GET PAYMENT BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/payments - Record a new payment
export const recordPayment = async (req, res) => {
  try {
    const { billId, amount, method, referenceNo, paymentDate } = req.body;
    const userId = req.user.id; // From JWT auth middleware

    // Validation
    if (!billId || amount === undefined || !method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: billId, amount, method'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const validMethods = ['Cash', 'Card', 'Online', 'Cheque'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${validMethods.join(', ')}`
      });
    }

    // Reference required for non-cash payments
    if (method !== 'Cash' && !referenceNo) {
      return res.status(400).json({
        success: false,
        message: 'Reference number is required for this payment method'
      });
    }

    const pool = await getPool();

    // Check bill exists and get outstanding amount
    const billCheckResult = await pool.request()
      .input('billId', sql.Int, billId)
      .query(`
        SELECT
          b.B_ID as id,
          b.B_TotalAmount as totalAmount,
          b.B_Status as status,
          (
            SELECT ISNULL(SUM(P_Amount), 0) FROM Payment
            WHERE B_ID = b.B_ID
          ) as totalPaid
        FROM Bill b
        WHERE b.B_ID = @billId
      `);

    if (billCheckResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    const bill = billCheckResult.recordset[0];
    const outstandingAmount = bill.totalAmount - bill.totalPaid;

    if (amount > outstandingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount cannot exceed outstanding balance of $${outstandingAmount.toFixed(2)}`
      });
    }

    // Call stored procedure to record payment
    const spResult = await pool.request()
      .input('BillId', sql.Int, billId)
      .input('UserId', sql.Int, userId)
      .input('Amount', sql.Decimal(10, 2), amount)
      .input('PaymentDate', sql.Date, paymentDate ? new Date(paymentDate) : new Date())
      .input('Method', sql.VarChar(50), method)
      .input('Reference', sql.VarChar(100), referenceNo || null)
      .execute('sp_process_payment');

    const spStatus = spResult.recordset[0];

    if (spStatus.Status === 'Error') {
      return res.status(400).json({
        success: false,
        message: spStatus.ErrorMsg
      });
    }

    // Fetch the newly created payment
    const newPaymentResult = await pool.request()
      .input('billId', sql.Int, billId)
      .query(`
        SELECT TOP 1
          p.P_ID as id,
          p.B_ID as billId,
          p.P_Amount as amount,
          p.P_Method as method,
          p.P_ReferenceNo as referenceNo,
          p.P_Date as paymentDate,
          c.C_Name as customerName,
          u.U_FullName as cashierName
        FROM Payment p
        INNER JOIN Bill b ON p.B_ID = b.B_ID
        INNER JOIN Customer c ON b.C_ID = c.C_ID
        INNER JOIN [User] u ON p.U_ID = u.U_ID
        WHERE p.B_ID = @billId
        ORDER BY p.P_ID DESC
      `);

    const newPayment = newPaymentResult.recordset[0];

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        id: newPayment.id,
        paymentId: `P-${String(newPayment.id).padStart(6, '0')}`,
        billId: `B-${String(newPayment.billId).padStart(6, '0')}`,
        customerName: newPayment.customerName,
        amount: `$${newPayment.amount.toFixed(2)}`,
        method: newPayment.method,
        referenceNo: newPayment.referenceNo || '-',
        paymentDate: formatDate(newPayment.paymentDate),
        cashierName: newPayment.cashierName
      }
    });

  } catch (error) {
    console.error('RECORD PAYMENT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/payments/bills/:customerId - Get unpaid/partially paid bills for customer
export const getBillsForPayment = async (req, res) => {
  try {
    const { customerId } = req.params;
    const pool = await getPool();

    const result = await pool.request()
      .input('customerId', sql.Int, customerId)
      .query(`
        SELECT
          b.B_ID as id,
          b.B_TotalAmount as totalAmount,
          b.B_Status as status,
          b.B_PeriodStart as billingPeriodStart,
          b.B_PeriodEnd as billingPeriodEnd,
          (
            SELECT ISNULL(SUM(P_Amount), 0) FROM Payment
            WHERE B_ID = b.B_ID
          ) as totalPaid
        FROM Bill b
        WHERE b.C_ID = @customerId
        AND b.B_Status IN ('Unpaid', 'Partially Paid')
        ORDER BY b.B_DueDate ASC
      `);

    const bills = result.recordset.map(bill => ({
      id: bill.id,
      billId: `B-${String(bill.id).padStart(6, '0')}`,
      totalAmount: bill.totalAmount,
      paidAmount: bill.totalPaid,
      outstandingAmount: bill.totalAmount - bill.totalPaid,
      status: bill.status,
      billingPeriod: `${formatDate(bill.billingPeriodStart)} - ${formatDate(bill.billingPeriodEnd)}`
    }));

    res.status(200).json({
      success: true,
      data: bills
    });

  } catch (error) {
    console.error('GET BILLS FOR PAYMENT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
