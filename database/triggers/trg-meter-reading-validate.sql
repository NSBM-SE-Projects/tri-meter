-- Trigger: Validate that new meter reading is not less than previous reading (prevent tampering)
CREATE TRIGGER trg_meter_reading_validate
ON MeterReading
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  -- Check if new reading is less than most recent previous reading
  IF EXISTS (
    SELECT 1
    FROM inserted i
    INNER JOIN MeterReading mr ON i.M_ID = mr.M_ID
    WHERE mr.R_Date < i.R_Date
      AND i.R_Value < mr.R_Value
  )
  BEGIN
    RAISERROR('Meter reading cannot be less than previous reading', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;
END;
GO
