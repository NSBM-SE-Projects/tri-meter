-- STEP 1: Move installation charge to Tariff table

-- Add installation charge column to Tariff
ALTER TABLE Tariff
ADD T_InstallationCharge DECIMAL(10,2) NOT NULL DEFAULT 0.00;
GO

-- Update existing tariffs with installation charges based on utility type
UPDATE Tariff
SET T_InstallationCharge = CASE
    WHEN Ut_ID = (SELECT Ut_ID FROM Utility WHERE Ut_Name = 'Electricity') THEN 100.00
    WHEN Ut_ID = (SELECT Ut_ID FROM Utility WHERE Ut_Name = 'Water') THEN 80.00
    WHEN Ut_ID = (SELECT Ut_ID FROM Utility WHERE Ut_Name = 'Gas') THEN 120.00
    ELSE 0.00
END;
GO

-- Drop installation charge column from ServiceConnection if it exists
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ServiceConnection') AND name = 'S_InstallationCharge')
BEGIN
    ALTER TABLE ServiceConnection DROP COLUMN S_InstallationCharge;
    PRINT 'Removed S_InstallationCharge from ServiceConnection.';
END
GO

-- STEP 2: Add new columns to ServiceConnection

-- Add S_InitialReading if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ServiceConnection') AND name = 'S_InitialReading')
BEGIN
    ALTER TABLE ServiceConnection ADD S_InitialReading DECIMAL(10,2) NULL;
END
GO

-- Add A_ID if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ServiceConnection') AND name = 'A_ID')
BEGIN
    ALTER TABLE ServiceConnection ADD A_ID INT NULL;
END
GO

-- Add foreign key for service address if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_S_Address')
BEGIN
    ALTER TABLE ServiceConnection
    ADD CONSTRAINT FK_S_Address FOREIGN KEY (A_ID) REFERENCES Address(A_ID);
END
GO

GO

-- STEP 2: Update Meter status constraint to include 'Disconnected'

-- Find and drop existing constraint
DECLARE @ConstraintName NVARCHAR(200);
SELECT @ConstraintName = name
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('Meter')
  AND COL_NAME(parent_object_id, parent_column_id) = 'M_Status';

IF @ConstraintName IS NOT NULL
BEGIN
    DECLARE @SQL NVARCHAR(MAX);
    SET @SQL = 'ALTER TABLE Meter DROP CONSTRAINT ' + QUOTENAME(@ConstraintName);
    EXEC sp_executesql @SQL;
    PRINT 'Dropped existing constraint: ' + @ConstraintName;
END
GO

-- Add new constraint with 'Disconnected' status
ALTER TABLE Meter
ADD CONSTRAINT CK_M_Status CHECK (M_Status IN ('Active', 'Faulty', 'Replaced', 'Disconnected'));
GO

GO

-- STEP 3: Trigger - Auto-disconnect meter when ServiceConnection deleted

IF OBJECT_ID('TR_S_Delete_DisconnectMeter', 'TR') IS NOT NULL
    DROP TRIGGER TR_S_Delete_DisconnectMeter;
GO

CREATE TRIGGER TR_S_Delete_DisconnectMeter
ON ServiceConnection
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Update meter status to Disconnected for deleted service connections
    UPDATE Meter
    SET M_Status = 'Disconnected'
    FROM Meter m
    INNER JOIN deleted d ON m.M_ID = d.M_ID
    WHERE m.M_Status = 'Active';

    PRINT 'Meter disconnected after ServiceConnection deletion.';
END;
GO

-- STEP 4: Trigger - Auto-cleanup address when ServiceConnection deleted

IF OBJECT_ID('TR_S_Delete_CleanupMeterAddress', 'TR') IS NOT NULL
    DROP TRIGGER TR_S_Delete_CleanupMeterAddress;
GO

CREATE TRIGGER TR_S_Delete_CleanupMeterAddress
ON ServiceConnection
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Address
    WHERE A_ID IN (
        SELECT DISTINCT d.A_ID
        FROM deleted d
        WHERE d.A_ID IS NOT NULL
          -- Not used as customer's primary address
          AND d.A_ID NOT IN (SELECT A_ID FROM Customer)
          -- Not used by any other service connections
          AND d.A_ID NOT IN (SELECT A_ID FROM ServiceConnection WHERE A_ID IS NOT NULL)
          -- Not used by any users
          AND d.A_ID NOT IN (SELECT A_ID FROM [User])
    );

    IF @@ROWCOUNT > 0
        PRINT 'Unused address cleaned up.';
END;
GO

IF OBJECT_ID('TR_S_Delete_CleanupAddress', 'TR') IS NOT NULL
    DROP TRIGGER TR_S_Delete_CleanupAddress;
GO

-- VERIFICATION
PRINT 'RAN SUCCESSFULLY!';
GO
