-- Stored Procedure: Get complete bill history for a customer with summary
CREATE PROCEDURE sp_get_customer_bill_history
  @CustomerId INT
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRY
    -- Bill details
    SELECT
      b.B_ID,
      CONCAT('B-', FORMAT(b.B_ID, '000')) as BillId,
      c.C_Name as CustomerName,
      m.M_Number as MeterNumber,
      u.Ut_Name as UtilityType,
      b.B_PeriodStart as PeriodStart,
      b.B_PeriodEnd as PeriodEnd,
      b.B_Consumption as Consumption,
      b.B_TotalAmount as BillAmount,
      COALESCE((SELECT SUM(P_Amount) FROM Payment WHERE B_ID = b.B_ID), 0) as AmountPaid,
      b.B_TotalAmount - COALESCE((SELECT SUM(P_Amount) FROM Payment WHERE B_ID = b.B_ID), 0) as BalanceOutstanding,
      b.B_Status as Status,
      b.B_DueDate as DueDate,
      CASE WHEN b.B_DueDate < GETDATE() AND b.B_Status != 'Paid' THEN DATEDIFF(DAY, b.B_DueDate, GETDATE()) ELSE 0 END as DaysOverdue
    FROM Bill b
    INNER JOIN Customer c ON b.C_ID = c.C_ID
    INNER JOIN Meter m ON b.M_ID = m.M_ID
    INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
    WHERE c.C_ID = @CustomerId
    ORDER BY b.B_Date DESC;

    -- Summary totals
    SELECT
      COUNT(*) as TotalBills,
      SUM(b.B_TotalAmount) as TotalBilled,
      COALESCE(SUM(p.P_Amount), 0) as TotalPaid,
      SUM(b.B_TotalAmount) - COALESCE(SUM(p.P_Amount), 0) as TotalOutstanding,
      SUM(CASE WHEN b.B_Status = 'Paid' THEN 1 ELSE 0 END) as PaidCount,
      SUM(CASE WHEN b.B_Status = 'Unpaid' THEN 1 ELSE 0 END) as UnpaidCount,
      SUM(CASE WHEN b.B_Status = 'Partially Paid' THEN 1 ELSE 0 END) as PartiallyPaidCount
    FROM Bill b
    LEFT JOIN Payment p ON b.B_ID = p.B_ID
    WHERE b.C_ID = @CustomerId;
  END TRY
  BEGIN CATCH
    SELECT ERROR_MESSAGE() as ErrorMsg;
  END CATCH;
END;
GO
