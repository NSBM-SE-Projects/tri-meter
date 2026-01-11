-- User-Defined Function: Format billing period as "MMM YYYY"
CREATE FUNCTION udf_format_bill_period(
  @PeriodStart DATE,
  @PeriodEnd DATE
)
RETURNS VARCHAR(50)
AS
BEGIN
  DECLARE @FormattedPeriod VARCHAR(50);

  IF YEAR(@PeriodStart) = YEAR(@PeriodEnd) AND MONTH(@PeriodStart) = MONTH(@PeriodEnd)
  BEGIN
    -- Same month: "Jan 2025"
    SET @FormattedPeriod = FORMAT(@PeriodStart, 'MMM yyyy');
  END
  ELSE IF YEAR(@PeriodStart) = YEAR(@PeriodEnd)
  BEGIN
    -- Same year: "Jan - Dec 2025"
    SET @FormattedPeriod = FORMAT(@PeriodStart, 'MMM') + ' - ' + FORMAT(@PeriodEnd, 'MMM yyyy');
  END
  ELSE
  BEGIN
    -- Different years: "Jan 2025 - Dec 2026"
    SET @FormattedPeriod = FORMAT(@PeriodStart, 'MMM yyyy') + ' - ' + FORMAT(@PeriodEnd, 'MMM yyyy');
  END;

  RETURN @FormattedPeriod;
END;
GO
