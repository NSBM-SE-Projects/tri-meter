-- User-Defined Function: Calculate consumption charge for given consumption and tariff
CREATE FUNCTION udf_calculate_consumption_charge(
  @Consumption DECIMAL(10,2),
  @TariffId INT,
  @UtilityType VARCHAR(50)
)
RETURNS DECIMAL(10,2)
AS
BEGIN
  DECLARE @ChargeAmount DECIMAL(10,2) = 0;

  IF @UtilityType = 'Electricity'
  BEGIN
    SELECT @ChargeAmount = CASE
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
    SELECT @ChargeAmount = @Consumption * W_FlatRate
    FROM WaterTariff
    WHERE W_T_ID = @TariffId;
  END
  ELSE IF @UtilityType = 'Gas'
  BEGIN
    SELECT @ChargeAmount = CASE
      WHEN @Consumption <= G_Slab1Max THEN @Consumption * G_Slab1Rate
      ELSE (G_Slab1Max * G_Slab1Rate) + ((@Consumption - G_Slab1Max) * G_Slab2Rate)
    END
    FROM GasTariff
    WHERE G_T_ID = @TariffId;
  END;

  RETURN ISNULL(@ChargeAmount, 0);
END;
GO
