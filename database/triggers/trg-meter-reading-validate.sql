-- Trigger: Validate that new meter reading is not less than previous reading (prevent tampering)
CREATE TRIGGER trg_meter_reading_validate
ON MeterReading
BEFORE INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  -- Check if new reading is less than most recent previous reading
  IF EXISTS (
    SELECT 1
    FROM inserted i
    INNER JOIN (
      SELECT M_ID, MAX(R_Date) as LatestDate
      FROM MeterReading mr
      WHERE mr.M_ID IN (SELECT M_ID FROM inserted)
        AND mr.R_Date < (SELECT R_Date FROM inserted WHERE M_ID = mr.M_ID)
      GROUP BY M_ID
    ) prev ON i.M_ID = prev.M_ID
    INNER JOIN MeterReading mr ON prev.M_ID = mr.M_ID AND prev.LatestDate = mr.R_Date
    WHERE i.R_Value < mr.R_Value
  )
  BEGIN
    RAISERROR('Meter reading cannot be less than previous reading', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;
END;
GO
