-- Trigger: Automatically update Bill status when Payment is processed
CREATE TRIGGER trg_payment_update_bill_status
ON Payment
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  -- Update bill status based on payment amount
  UPDATE b
  SET b.B_Status = CASE
    WHEN SUM(p.P_Amount) >= b.B_TotalAmount THEN 'Paid'
    WHEN SUM(p.P_Amount) > 0 THEN 'Partially Paid'
    ELSE b.B_Status
  END
  FROM Bill b
  INNER JOIN Payment p ON b.B_ID = p.B_ID
  WHERE b.B_ID IN (SELECT B_ID FROM inserted)
  GROUP BY b.B_ID, b.B_TotalAmount;
END;
GO
