-- User-Defined Function: Get applicable tariff rate for given consumption level
CREATE FUNCTION udf_get_tariff_rate(
  @Consumption DECIMAL(10,2),
  @TariffId INT,
  @UtilityType VARCHAR(50)
)
RETURNS DECIMAL(10,2)
AS
BEGIN
  DECLARE @Rate DECIMAL(10,2) = 0;

  IF @UtilityType = 'Electricity'
  BEGIN
    SELECT @Rate = CASE
      WHEN @Consumption <= E_Slab1Max THEN E_Slab1Rate
      WHEN @Consumption <= E_Slab2Max THEN E_Slab2Rate
      ELSE E_Slab3Rate
    END
    FROM ElectricityTariff
    WHERE E_T_ID = @TariffId;
  END
  ELSE IF @UtilityType = 'Water'
  BEGIN
    SELECT @Rate = W_FlatRate
    FROM WaterTariff
    WHERE W_T_ID = @TariffId;
  END
  ELSE IF @UtilityType = 'Gas'
  BEGIN
    SELECT @Rate = CASE
      WHEN @Consumption <= G_Slab1Max THEN G_Slab1Rate
      ELSE G_Slab2Rate
    END
    FROM GasTariff
    WHERE G_T_ID = @TariffId;
  END;

  RETURN ISNULL(@Rate, 0);
END;
GO
