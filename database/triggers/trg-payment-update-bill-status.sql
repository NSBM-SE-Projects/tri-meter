-- Trigger: Automatically update Bill status when Payment is processed
CREATE TRIGGER trg_payment_update_bill_status
ON Payment
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  -- Update bill status based on total payment amount
  UPDATE b
  SET b.B_Status = CASE
    WHEN payments.TotalPaid >= b.B_TotalAmount THEN 'Paid'
    WHEN payments.TotalPaid > 0 THEN 'Partially Paid'
    ELSE b.B_Status
  END
  FROM Bill b
  INNER JOIN (
    SELECT B_ID, SUM(P_Amount) as TotalPaid
    FROM Payment
    WHERE B_ID IN (SELECT B_ID FROM inserted)
    GROUP BY B_ID
  ) payments ON b.B_ID = payments.B_ID;
END;
GO
