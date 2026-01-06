-- View: Billing summary for each customer
CREATE VIEW vw_customer_billing_summary AS
SELECT
  c.C_ID,
  c.C_Name as CustomerName,
  c.C_Email as Email,
  c.C_Type as CustomerType,
  COUNT(DISTINCT b.B_ID) as TotalBillsIssued,
  SUM(b.B_TotalAmount) as TotalBilled,
  COALESCE(SUM(p.P_Amount), 0) as TotalPaid,
  SUM(b.B_TotalAmount) - COALESCE(SUM(p.P_Amount), 0) as OutstandingBalance,
  SUM(CASE WHEN b.B_Status = 'Paid' THEN 1 ELSE 0 END) as PaidBillCount,
  SUM(CASE WHEN b.B_Status = 'Unpaid' THEN 1 ELSE 0 END) as UnpaidBillCount,
  SUM(CASE WHEN b.B_Status = 'Partially Paid' THEN 1 ELSE 0 END) as PartiallyPaidCount,
  MAX(b.B_Date) as LastBillDate,
  DATEDIFF(DAY, MAX(b.B_Date), GETDATE()) as DaysSinceLastBill
FROM Customer c
LEFT JOIN ServiceConnection sc ON c.C_ID = sc.C_ID
LEFT JOIN Bill b ON sc.M_ID = b.M_ID
LEFT JOIN Payment p ON b.B_ID = p.B_ID
GROUP BY c.C_ID, c.C_Name, c.C_Email, c.C_Type;
GO
