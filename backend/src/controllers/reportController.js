import { getPool } from '../config/database.js';
import sql from 'mssql';

// 1. Get Unpaid Bills Summary
export const getUnpaidBillsSummary = async (req, res) => {
  try {
    const pool = await getPool();
    const { utilityType, minDaysOverdue } = req.query;

    let query = `SELECT * FROM vw_unpaid_bills_summary WHERE 1=1`;
    const request = pool.request();

    if (utilityType && utilityType !== 'All') {
      query += ` AND UtilityType = @utilityType`;
      request.input('utilityType', sql.VarChar(50), utilityType);
    }

    if (minDaysOverdue) {
      query += ` AND DaysOverdue >= @minDaysOverdue`;
      request.input('minDaysOverdue', sql.Int, parseInt(minDaysOverdue));
    }

    query += ` ORDER BY DaysOverdue DESC`;

    const result = await request.query(query);

    // Transform to camelCase
    const bills = result.recordset.map(row => ({
      billId: row.BillId,
      customerId: row.CustomerId,
      customerName: row.CustomerName,
      utilityType: row.UtilityType,
      meterNumber: row.MeterNumber,
      periodStart: row.PeriodStart,
      periodEnd: row.PeriodEnd,
      billAmount: parseFloat(row.BillAmount),
      amountPaid: parseFloat(row.AmountPaid),
      balanceOutstanding: parseFloat(row.BalanceOutstanding),
      dueDate: row.DueDate,
      daysOverdue: row.DaysOverdue,
      status: row.Status
    }));

    // Calculate summary
    const summary = {
      totalUnpaidBills: bills.length,
      totalAmount: bills.reduce((sum, b) => sum + b.balanceOutstanding, 0),
      avgDaysOverdue: bills.length > 0
        ? Math.round(bills.reduce((sum, b) => sum + b.daysOverdue, 0) / bills.length)
        : 0
    };

    // Generate chart data (group by utility)
    const chartData = bills.reduce((acc, bill) => {
      const existing = acc.find(item => item.utilityType === bill.utilityType);
      if (existing) {
        existing.count++;
        existing.amount += bill.balanceOutstanding;
      } else {
        acc.push({
          utilityType: bill.utilityType,
          count: 1,
          amount: bill.balanceOutstanding
        });
      }
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      data: { summary, bills, chartData }
    });

  } catch (error) {
    console.error('GET_UNPAID_BILLS_SUMMARY ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unpaid bills summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 2. Get Monthly Revenue
export const getMonthlyRevenue = async (req, res) => {
  try {
    const pool = await getPool();
    const { startMonth, endMonth, utilityType } = req.query;

    let query = `SELECT * FROM vw_monthly_revenue WHERE 1=1`;
    const request = pool.request();

    if (startMonth) {
      query += ` AND YearMonth >= @startMonth`;
      request.input('startMonth', sql.VarChar(7), startMonth);
    }

    if (endMonth) {
      query += ` AND YearMonth <= @endMonth`;
      request.input('endMonth', sql.VarChar(7), endMonth);
    }

    if (utilityType && utilityType !== 'All') {
      query += ` AND UtilityType = @utilityType`;
      request.input('utilityType', sql.VarChar(50), utilityType);
    }

    query += ` ORDER BY YearMonth DESC, UtilityType`;

    const result = await request.query(query);

    // Transform to camelCase
    const revenue = result.recordset.map(row => ({
      yearMonth: row.YearMonth,
      year: row.Year,
      month: row.Month,
      utilityType: row.UtilityType,
      billCount: row.BillCount,
      totalBilled: parseFloat(row.TotalBilled),
      totalPaid: parseFloat(row.TotalPaid),
      outstandingAmount: parseFloat(row.OutstandingAmount),
      paidAmount: parseFloat(row.PaidAmount),
      unpaidAmount: parseFloat(row.UnpaidAmount)
    }));

    // Calculate summary
    const summary = {
      totalBilled: revenue.reduce((sum, r) => sum + r.totalBilled, 0),
      totalPaid: revenue.reduce((sum, r) => sum + r.totalPaid, 0),
      totalOutstanding: revenue.reduce((sum, r) => sum + r.outstandingAmount, 0),
      collectionRate: 0
    };

    if (summary.totalBilled > 0) {
      summary.collectionRate = parseFloat(((summary.totalPaid / summary.totalBilled) * 100).toFixed(2));
    }

    // Transform for multi-line chart (group by month, pivot utilities)
    const monthMap = new Map();
    revenue.forEach(row => {
      if (!monthMap.has(row.yearMonth)) {
        monthMap.set(row.yearMonth, {
          date: row.yearMonth,
          electricity: 0,
          water: 0,
          gas: 0
        });
      }
      const monthData = monthMap.get(row.yearMonth);
      monthData[row.utilityType.toLowerCase()] = row.totalPaid;
    });

    const chartData = Array.from(monthMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    res.status(200).json({
      success: true,
      data: { summary, revenue, chartData }
    });

  } catch (error) {
    console.error('GET_MONTHLY_REVENUE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly revenue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 3. Get Customer Billing Summary
export const getCustomerBillingSummary = async (req, res) => {
  try {
    const pool = await getPool();
    const { customerType, minOutstanding, sortBy, sortOrder } = req.query;

    let query = `SELECT * FROM vw_customer_billing_summary WHERE 1=1`;
    const request = pool.request();

    if (customerType && customerType !== 'All') {
      query += ` AND CustomerType = @customerType`;
      request.input('customerType', sql.VarChar(50), customerType);
    }

    if (minOutstanding) {
      query += ` AND OutstandingBalance >= @minOutstanding`;
      request.input('minOutstanding', sql.Decimal(10, 2), parseFloat(minOutstanding));
    }

    // Default sort
    let orderByClause = ' ORDER BY OutstandingBalance DESC';

    if (sortBy) {
      const columnMap = {
        'totalBilled': 'TotalBilled',
        'totalPaid': 'TotalPaid',
        'outstandingBalance': 'OutstandingBalance'
      };
      const sqlColumn = columnMap[sortBy] || 'OutstandingBalance';
      const order = (sortOrder && sortOrder.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
      orderByClause = ` ORDER BY ${sqlColumn} ${order}`;
    }

    query += orderByClause;

    const result = await request.query(query);

    // Transform to camelCase
    const customers = result.recordset.map(row => ({
      customerId: row.C_ID,
      customerName: row.CustomerName,
      email: row.Email,
      customerType: row.CustomerType,
      totalBillsIssued: row.TotalBillsIssued,
      totalBilled: parseFloat(row.TotalBilled) || 0,
      totalPaid: parseFloat(row.TotalPaid) || 0,
      outstandingBalance: parseFloat(row.OutstandingBalance) || 0,
      paidBillCount: row.PaidBillCount,
      unpaidBillCount: row.UnpaidBillCount,
      partiallyPaidCount: row.PartiallyPaidCount,
      lastBillDate: row.LastBillDate,
      daysSinceLastBill: row.DaysSinceLastBill
    }));

    // Calculate summary
    const summary = {
      totalCustomers: customers.length,
      totalBilled: customers.reduce((sum, c) => sum + c.totalBilled, 0),
      totalPaid: customers.reduce((sum, c) => sum + c.totalPaid, 0),
      totalOutstanding: customers.reduce((sum, c) => sum + c.outstandingBalance, 0)
    };

    res.status(200).json({
      success: true,
      data: { summary, customers }
    });

  } catch (error) {
    console.error('GET_CUSTOMER_BILLING_SUMMARY ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer billing summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 4. Get Top Consumers
export const getTopConsumers = async (req, res) => {
  try {
    const pool = await getPool();
    const { utilityType, limit, customerType } = req.query;

    const limitValue = limit ? parseInt(limit) : 10;

    let query = `SELECT TOP ${limitValue} * FROM vw_top_consumers WHERE 1=1`;
    const request = pool.request();

    if (utilityType && utilityType !== 'All') {
      query += ` AND UtilityType = @utilityType`;
      request.input('utilityType', sql.VarChar(50), utilityType);
    }

    if (customerType && customerType !== 'All') {
      query += ` AND CustomerType = @customerType`;
      request.input('customerType', sql.VarChar(50), customerType);
    }

    query += ` ORDER BY TotalConsumption DESC`;

    const result = await request.query(query);

    // Transform to camelCase
    const consumers = result.recordset.map((row, index) => ({
      rank: index + 1,
      customerId: row.CustomerId,
      customerName: row.CustomerName,
      customerType: row.CustomerType,
      utilityType: row.UtilityType,
      unit: row.Unit,
      totalConsumption: parseFloat(row.TotalConsumption),
      billCount: row.BillCount,
      totalAmount: parseFloat(row.TotalAmount),
      avgConsumption: parseFloat(row.AvgConsumption)
    }));

    // Calculate summary
    const summary = {
      totalConsumers: consumers.length,
      totalConsumption: consumers.reduce((sum, c) => sum + c.totalConsumption, 0),
      avgConsumption: consumers.length > 0
        ? parseFloat((consumers.reduce((sum, c) => sum + c.totalConsumption, 0) / consumers.length).toFixed(2))
        : 0
    };

    // Chart data (top 10 for chart)
    const chartData = consumers.slice(0, 10).map(c => ({
      customerName: c.customerName,
      consumption: c.totalConsumption,
      customerType: c.customerType,
      utility: c.utilityType
    }));

    res.status(200).json({
      success: true,
      data: { summary, consumers, chartData }
    });

  } catch (error) {
    console.error('GET_TOP_CONSUMERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top consumers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
