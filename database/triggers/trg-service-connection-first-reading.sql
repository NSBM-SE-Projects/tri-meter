-- Trigger: Auto-create initial meter reading when service connection is created
CREATE TRIGGER trg_service_connection_first_reading
ON ServiceConnection
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  -- Create initial meter reading of 0 for new service connections
  INSERT INTO MeterReading (M_ID, R_Date, R_Value, R_TamperedFlag, U_ID)
  SELECT
    i.M_ID,
    GETDATE(),
    0,
    0,
    (SELECT U_ID FROM User WHERE U_Role = 'Field Officer' LIMIT 1)
  FROM inserted i
  WHERE NOT EXISTS (
    SELECT 1 FROM MeterReading WHERE M_ID = i.M_ID
  );
END;
GO
