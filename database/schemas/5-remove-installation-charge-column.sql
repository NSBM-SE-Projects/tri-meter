-- Remove S_InstallationCharge column from ServiceConnection table

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ServiceConnection') AND name = 'S_InstallationCharge')
BEGIN
    ALTER TABLE ServiceConnection DROP COLUMN S_InstallationCharge;
    PRINT 'Removed installation charge';
END
ELSE
BEGIN
    PRINT 'Column does not exist in serviceconnection table.';
END
GO
