-- User-Defined Function: Calculate late fee based on days overdue
CREATE FUNCTION udf_calculate_late_fee(
  @BillAmount DECIMAL(10,2),
  @DueDate DATE
)
RETURNS DECIMAL(10,2)
AS
BEGIN
  DECLARE @DaysOverdue INT = DATEDIFF(DAY, @DueDate, GETDATE());
  DECLARE @LateFeeRate DECIMAL(5,2) = 0.05; -- 5% per month
  DECLARE @MaxLateFee DECIMAL(10,2) = @BillAmount * 0.20; -- Max 20% of bill
  DECLARE @CalculatedFee DECIMAL(10,2) = 0;

  -- Only apply late fee if overdue
  IF @DaysOverdue > 0
  BEGIN
    -- Calculate fee: 5% for first month, then increases
    SET @CalculatedFee = CASE
      WHEN @DaysOverdue <= 30 THEN @BillAmount * 0.05
      WHEN @DaysOverdue <= 60 THEN @BillAmount * 0.10
      WHEN @DaysOverdue <= 90 THEN @BillAmount * 0.15
      ELSE @BillAmount * 0.20
    END;

    -- Cap at 20% of bill
    SET @CalculatedFee = CASE
      WHEN @CalculatedFee > @MaxLateFee THEN @MaxLateFee
      ELSE @CalculatedFee
    END;
  END;

  RETURN ISNULL(@CalculatedFee, 0);
END;
GO
