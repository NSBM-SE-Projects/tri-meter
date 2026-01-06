-- Stored Procedure: Calculate and return bill amount for given consumption and tariff
CREATE PROCEDURE sp_calculate_bill_amount
  @Consumption DECIMAL(10,2),
  @TariffId INT,
  @UtilityType VARCHAR(50),
  @Output DECIMAL(10,2) OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @ConsumptionCharge DECIMAL(10,2) = 0;
  DECLARE @FixedCharge DECIMAL(10,2) = 0;

  BEGIN TRY
    IF @UtilityType = 'Electricity'
    BEGIN
      SELECT
        @ConsumptionCharge = CASE
          WHEN @Consumption <= E_Slab1Max THEN @Consumption * E_Slab1Rate
          WHEN @Consumption <= E_Slab2Max THEN
            (E_Slab1Max * E_Slab1Rate) + ((@Consumption - E_Slab1Max) * E_Slab2Rate)
          ELSE
            (E_Slab1Max * E_Slab1Rate) + ((E_Slab2Max - E_Slab1Max) * E_Slab2Rate) +
            ((@Consumption - E_Slab2Max) * E_Slab3Rate)
        END
      FROM ElectricityTariff
      WHERE E_T_ID = @TariffId;
    END
    ELSE IF @UtilityType = 'Water'
    BEGIN
      SELECT
        @ConsumptionCharge = @Consumption * W_FlatRate,
        @FixedCharge = W_FixedCharge
      FROM WaterTariff
      WHERE W_T_ID = @TariffId;
    END
    ELSE IF @UtilityType = 'Gas'
    BEGIN
      SELECT
        @ConsumptionCharge = CASE
          WHEN @Consumption <= G_Slab1Max THEN @Consumption * G_Slab1Rate
          ELSE (G_Slab1Max * G_Slab1Rate) + ((@Consumption - G_Slab1Max) * G_Slab2Rate)
        END
      FROM GasTariff
      WHERE G_T_ID = @TariffId;
    END;

    SET @Output = COALESCE(@ConsumptionCharge, 0) + COALESCE(@FixedCharge, 0);
  END TRY
  BEGIN CATCH
    SELECT ERROR_MESSAGE() as ErrorMsg;
    SET @Output = 0;
  END CATCH;
END;
GO
