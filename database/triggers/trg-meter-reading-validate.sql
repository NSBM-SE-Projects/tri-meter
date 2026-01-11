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
    INNER JOIN (
      SELECT M_ID, MAX(R_Date) as LatestDate
      FROM MeterReading
      GROUP BY M_ID
    ) latest ON i.M_ID = latest.M_ID
    INNER JOIN MeterReading mr ON latest.M_ID = mr.M_ID AND latest.LatestDate = mr.R_Date
    WHERE i.R_Value < mr.R_Value
  )
  BEGIN
    RAISERROR('Meter reading cannot be less than the most recent reading', 16, 1);
  END;
END;
GO
