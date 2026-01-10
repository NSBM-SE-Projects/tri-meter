-- View: Summary of all unpaid bills with customer and meter information
CREATE VIEW vw_unpaid_bills_summary AS
SELECT
  b.B_ID,
  CONCAT('B-', FORMAT(b.B_ID, '000')) as BillId,
  c.C_Name as CustomerName,
  c.C_ID as CustomerId,
  m.M_Number as MeterNumber,
  u.Ut_Name as UtilityType,
  b.B_PeriodStart as PeriodStart,
  b.B_PeriodEnd as PeriodEnd,
  b.B_TotalAmount as BillAmount,
  COALESCE((SELECT SUM(P_Amount) FROM Payment WHERE B_ID = b.B_ID), 0) as AmountPaid,
  b.B_TotalAmount - COALESCE((SELECT SUM(P_Amount) FROM Payment WHERE B_ID = b.B_ID), 0) as BalanceOutstanding,
  b.B_DueDate as DueDate,
  DATEDIFF(DAY, b.B_DueDate, GETDATE()) as DaysOverdue,
  b.B_Status as Status
FROM Bill b
INNER JOIN Customer c ON b.C_ID = c.C_ID
INNER JOIN Meter m ON b.M_ID = m.M_ID
INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
WHERE b.B_Status IN ('Unpaid', 'Partially Paid')
  AND b.B_DueDate < GETDATE();
GO
