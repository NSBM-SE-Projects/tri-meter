-- View: Monthly revenue summary by utility type and payment status
CREATE VIEW vw_monthly_revenue AS
SELECT
  YEAR(b.B_Date) as Year,
  MONTH(b.B_Date) as Month,
  CONVERT(VARCHAR(7), b.B_Date, 121) as YearMonth,
  u.Ut_Name as UtilityType,
  COUNT(b.B_ID) as BillCount,
  SUM(b.B_TotalAmount) as TotalBilled,
  COALESCE(SUM(p.P_Amount), 0) as TotalPaid,
  SUM(b.B_TotalAmount) - COALESCE(SUM(p.P_Amount), 0) as OutstandingAmount,
  SUM(CASE WHEN b.B_Status = 'Paid' THEN b.B_TotalAmount ELSE 0 END) as PaidAmount,
  SUM(CASE WHEN b.B_Status IN ('Unpaid', 'Partially Paid') THEN b.B_TotalAmount ELSE 0 END) as UnpaidAmount
FROM Bill b
INNER JOIN Meter m ON b.M_ID = m.M_ID
INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
LEFT JOIN Payment p ON b.B_ID = p.B_ID
GROUP BY YEAR(b.B_Date), MONTH(b.B_Date), CONVERT(VARCHAR(7), b.B_Date, 121), u.Ut_Name;
GO
