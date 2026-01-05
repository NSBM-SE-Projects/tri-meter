-- Trigger: Auto-update ServiceConnections when new Tariff is created

IF OBJECT_ID('TR_T_UpdateServiceConnections', 'TR') IS NOT NULL
    DROP TRIGGER TR_T_UpdateServiceConnections;
GO

CREATE TRIGGER TR_T_UpdateServiceConnections
ON Tariff
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE ServiceConnection
    SET T_ID = i.T_ID
    FROM ServiceConnection sc
    INNER JOIN inserted i ON 1=1
    INNER JOIN Tariff oldTariff ON sc.T_ID = oldTariff.T_ID
    WHERE sc.S_Status = 'Active'
        AND oldTariff.Ut_ID = i.Ut_ID
        AND oldTariff.T_CustomerType = i.T_CustomerType
        AND i.T_ValidFrom <= GETDATE()
        AND (i.T_ValidTo IS NULL OR i.T_ValidTo >= GETDATE())
        AND i.T_ValidFrom > oldTariff.T_ValidFrom;

    PRINT 'Trigger: Updated service connections to new tariff.';
END;
GO
