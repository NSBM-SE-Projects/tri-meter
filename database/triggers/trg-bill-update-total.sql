-- Trigger: Automatically update Bill total amount when BillLineItem is inserted/updated
CREATE TRIGGER trg_bill_update_total
ON BillLineItem
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  -- Update the bill's total amount based on sum of line items + late fees + previous balance
  UPDATE b
  SET b.B_TotalAmount = COALESCE(bli.TotalLineItems, 0) + COALESCE(b.B_LateFee, 0) + COALESCE(b.B_PreviousBalance, 0)
  FROM Bill b
  INNER JOIN (
    SELECT B_ID, SUM(Bl_Amount) as TotalLineItems
    FROM BillLineItem
    GROUP BY B_ID
  ) bli ON b.B_ID = bli.B_ID
  WHERE b.B_ID IN (SELECT B_ID FROM inserted);
END;
GO
