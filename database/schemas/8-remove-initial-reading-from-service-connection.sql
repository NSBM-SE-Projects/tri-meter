-- Remove S_InitialReading column from ServiceConnection table

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ServiceConnection') AND name = 'S_InitialReading')
BEGIN
    ALTER TABLE ServiceConnection DROP COLUMN S_InitialReading;
    PRINT 'Removed initialreading from serviceConnection table.';
END
ELSE
BEGIN
    PRINT 'Column does not exist in serviceConnection table.';
END
GO
