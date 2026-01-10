-- View: All overdue bills with customer and aging information
CREATE VIEW vw_overdue_bills AS
SELECT
  b.B_ID,
  CONCAT('B-', FORMAT(b.B_ID, '000')) as BillId,
  c.C_Name as CustomerName,
  c.C_ID as CustomerId,
  c.C_Email as Email,
  m.M_Number as MeterNumber,
  u.Ut_Name as UtilityType,
  b.B_TotalAmount as BillAmount,
  COALESCE((SELECT SUM(P_Amount) FROM Payment WHERE B_ID = b.B_ID), 0) as AmountPaid,
  b.B_TotalAmount - COALESCE((SELECT SUM(P_Amount) FROM Payment WHERE B_ID = b.B_ID), 0) as BalanceDue,
  b.B_DueDate as DueDate,
  DATEDIFF(DAY, b.B_DueDate, GETDATE()) as DaysOverdue,
  CASE
    WHEN DATEDIFF(DAY, b.B_DueDate, GETDATE()) < 30 THEN 'Current'
    WHEN DATEDIFF(DAY, b.B_DueDate, GETDATE()) < 60 THEN '30-59 Days'
    WHEN DATEDIFF(DAY, b.B_DueDate, GETDATE()) < 90 THEN '60-89 Days'
    ELSE '90+ Days'
  END as AgeingBucket,
  b.B_Status as Status
FROM Bill b
INNER JOIN Customer c ON b.C_ID = c.C_ID
INNER JOIN Meter m ON b.M_ID = m.M_ID
INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
WHERE b.B_Status IN ('Unpaid', 'Partially Paid')
  AND b.B_DueDate < GETDATE()
ORDER BY DATEDIFF(DAY, b.B_DueDate, GETDATE()) DESC;
GO
