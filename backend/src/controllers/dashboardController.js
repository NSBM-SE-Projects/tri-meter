import { getPool } from '../config/database.js';

/**
 * GET /api/dashboard
 */
export const getDashboardStats = async (req, res) => {
  try {
    const pool = await getPool();

    const customersResult = await pool.request()
      .query('SELECT COUNT(*) as totalCustomers FROM Customer');

    const metersResult = await pool.request()
      .query("SELECT COUNT(*) as activeMeters FROM Meter WHERE M_Status = 'Active'");

    const revenueResult = await pool.request()
      .query(`
        -- Current month revenue
        WITH RecentMonth AS (
          SELECT TOP 1
            YEAR(P_Date) as PayYear,
            MONTH(P_Date) as PayMonth
          FROM Payment
          ORDER BY P_Date DESC
        ),
        CurrentRevenue AS (
          SELECT ISNULL(SUM(P_Amount), 0) as revenue
          FROM Payment p
          CROSS JOIN RecentMonth rm
          WHERE YEAR(p.P_Date) = rm.PayYear
            AND MONTH(p.P_Date) = rm.PayMonth
        ),
        PreviousRevenue AS (
          SELECT ISNULL(SUM(P_Amount), 0) as revenue
          FROM Payment p
          CROSS JOIN RecentMonth rm
          WHERE YEAR(p.P_Date) = rm.PayYear
            AND MONTH(p.P_Date) = rm.PayMonth - 1
        )
        SELECT
          cr.revenue as currentRevenue,
          pr.revenue as previousRevenue,
          CASE
            WHEN pr.revenue > 0 THEN
              ROUND(((cr.revenue - pr.revenue) / pr.revenue) * 100, 1)
            ELSE 0
          END as percentageChange
        FROM CurrentRevenue cr, PreviousRevenue pr
      `);

    // Get meter readings for current period (most recent month)
    const readingsResult = await pool.request()
      .query(`
        SELECT COUNT(*) as meterReadings
        FROM MeterReading mr
        WHERE YEAR(mr.R_Date) = (
          SELECT TOP 1 YEAR(R_Date)
          FROM MeterReading
          ORDER BY R_Date DESC
        )
        AND MONTH(mr.R_Date) = (
          SELECT TOP 1 MONTH(R_Date)
          FROM MeterReading
          ORDER BY R_Date DESC
        )
      `);

    const stats = {
      totalCustomers: customersResult.recordset[0].totalCustomers,
      activeMeters: metersResult.recordset[0].activeMeters,
      currentRevenue: revenueResult.recordset[0].currentRevenue,
      previousRevenue: revenueResult.recordset[0].previousRevenue,
      revenueChange: revenueResult.recordset[0].percentageChange,
      meterReadings: readingsResult.recordset[0].meterReadings,
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('DASHBOARD STATS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// GET /api/dashboard/revenue-trends?range=7d|30d|90d
export const getRevenueTrends = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const pool = await getPool();

    // Determine days based on range
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

    const result = await pool.request()
      .input('daysBack', days)
      .query(`
        SELECT
          CAST(p.P_Date AS DATE) as date,
          SUM(CASE WHEN u.Ut_Name = 'Electricity' THEN p.P_Amount ELSE 0 END) as electricity,
          SUM(CASE WHEN u.Ut_Name = 'Water' THEN p.P_Amount ELSE 0 END) as water,
          SUM(CASE WHEN u.Ut_Name = 'Gas' THEN p.P_Amount ELSE 0 END) as gas
        FROM Payment p
        INNER JOIN Bill b ON p.B_ID = b.B_ID
        INNER JOIN Meter m ON b.M_ID = m.M_ID
        INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
        WHERE p.P_Date >= DATEADD(day, -@daysBack, (SELECT MAX(P_Date) FROM Payment))
        GROUP BY CAST(p.P_Date AS DATE)
        ORDER BY CAST(p.P_Date AS DATE)
      `);

    res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error('REVENUE TRENDS ERROR:', error);
    console.error('ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue trends',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// GET /api/dashboard/activity
export const getRecentActivity = async (req, res) => {
  try {
    const pool = await getPool();

    // Get recent activities - simplified query
    const result = await pool.request()
      .query(`
        SELECT TOP 20
          activityType,
          description,
          activityDate,
          performedBy
        FROM (
          SELECT
            'New Customer' as activityType,
            'New customer: ' + c.C_Name as description,
            c.C_RegistrationDate as activityDate,
            'Admin' as performedBy
          FROM Customer c
          WHERE c.C_RegistrationDate IS NOT NULL

          UNION ALL

          -- Recent meter readings
          SELECT
            'Meter Reading' as activityType,
            'Meter #' + m.M_Number + ' reading: ' + CAST(mr.R_Value AS VARCHAR(20)) + ' units' as description,
            mr.R_Date as activityDate,
            ISNULL(u.U_FullName, 'Field Officer') as performedBy
          FROM MeterReading mr
          INNER JOIN Meter m ON mr.M_ID = m.M_ID
          LEFT JOIN [User] u ON mr.U_ID = u.U_ID
          WHERE mr.R_Date IS NOT NULL

          UNION ALL

          -- Recent bills
          SELECT
            'Bill Generated' as activityType,
            'Bill #' + CAST(b.B_ID AS VARCHAR(10)) + ' for customer - $' + CAST(b.B_TotalAmount AS VARCHAR(20)) as description,
            b.B_Date as activityDate,
            'Billing System' as performedBy
          FROM Bill b
          WHERE b.B_Date IS NOT NULL

          UNION ALL

          -- Recent payments
          SELECT
            'Payment' as activityType,
            'Payment $' + CAST(p.P_Amount AS VARCHAR(20)) + ' for bill #' + CAST(p.B_ID AS VARCHAR(10)) as description,
            p.P_Date as activityDate,
            ISNULL(u.U_FullName, 'Cashier') as performedBy
          FROM Payment p
          LEFT JOIN [User] u ON p.U_ID = u.U_ID
          WHERE p.P_Date IS NOT NULL
        ) as ActivityLog
        ORDER BY activityDate DESC
      `);

    res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error('ACTIVITY LOGS ERROR:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
