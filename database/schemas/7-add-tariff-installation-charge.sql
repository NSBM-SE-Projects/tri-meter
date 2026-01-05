-- Add T_InstallationCharge column to Tariff table

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Tariff') AND name = 'T_InstallationCharge')
BEGIN
    ALTER TABLE Tariff
    ADD T_InstallationCharge DECIMAL(10,2) NOT NULL DEFAULT 0.00;
    PRINT 'Added column to tariff table.';
END
ELSE
BEGIN
    PRINT 'Column already exists in tariff table.';
END
GO

UPDATE Tariff
SET T_InstallationCharge = CASE
    WHEN Ut_ID = (SELECT Ut_ID FROM Utility WHERE Ut_Name = 'Electricity') THEN 100.00
    WHEN Ut_ID = (SELECT Ut_ID FROM Utility WHERE Ut_Name = 'Water') THEN 80.00
    WHEN Ut_ID = (SELECT Ut_ID FROM Utility WHERE Ut_Name = 'Gas') THEN 120.00
    ELSE 0.00
END
WHERE T_InstallationCharge = 0.00;
GO

PRINT 'Installation charges updated for existing tariffs.';
GO
