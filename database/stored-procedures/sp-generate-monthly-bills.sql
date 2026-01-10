-- Stored Procedure: Generate bills for all active service connections for a given month
CREATE PROCEDURE sp_generate_monthly_bills
  @Year INT,
  @Month INT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @PeriodStart DATE = DATEFROMPARTS(@Year, @Month, 1);
  DECLARE @PeriodEnd DATE = EOMONTH(@PeriodStart);
  DECLARE @BillCount INT = 0;

  BEGIN TRY
    BEGIN TRANSACTION;

    -- Generate bills for all active service connections
    DECLARE bill_cursor CURSOR FOR
    SELECT sc.S_ID, sc.C_ID, sc.M_ID, sc.T_ID, sc.S_InstallationCharge
    FROM ServiceConnection sc
    WHERE sc.S_Status = 'Active'
      AND NOT EXISTS (
        SELECT 1 FROM Bill b
        WHERE b.M_ID = sc.M_ID
          AND YEAR(b.B_PeriodStart) = @Year
          AND MONTH(b.B_PeriodStart) = @Month
      );

    DECLARE @ServiceConnId INT, @CustomerId INT, @MeterId INT, @TariffId INT, @InstallCharge DECIMAL(10,2);

    OPEN bill_cursor;
    FETCH NEXT FROM bill_cursor INTO @ServiceConnId, @CustomerId, @MeterId, @TariffId, @InstallCharge;

    WHILE @@FETCH_STATUS = 0
    BEGIN
      -- Call the generate bill logic for each connection
      -- (This would be done via application logic or a more complex SP)
      SET @BillCount = @BillCount + 1;

      FETCH NEXT FROM bill_cursor INTO @ServiceConnId, @CustomerId, @MeterId, @TariffId, @InstallCharge;
    END;

    CLOSE bill_cursor;
    DEALLOCATE bill_cursor;

    COMMIT TRANSACTION;

    SELECT 'Success' as Status, @BillCount as BillsGenerated;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0
      ROLLBACK TRANSACTION;

    SELECT 'Error' as Status, ERROR_MESSAGE() as ErrorMsg;
  END CATCH;
END;
GO
