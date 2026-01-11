-- View: Top Consumers Ranking by Consumption
-- Purpose: Rank customers by total consumption across all utilities
-- Used by: Reports page (Top Consumers section)

IF OBJECT_ID('vw_top_consumers', 'V') IS NOT NULL
  DROP VIEW vw_top_consumers;
GO

CREATE VIEW vw_top_consumers AS
WITH ConsumptionSummary AS (
  SELECT
    c.C_ID as CustomerId,
    c.C_Name as CustomerName,
    c.C_Type as CustomerType,
    u.Ut_Name as UtilityType,
    u.Ut_Unit as Unit,
    SUM(b.B_Consumption) as TotalConsumption,
    COUNT(b.B_ID) as BillCount,
    SUM(b.B_TotalAmount) as TotalAmount,
    AVG(b.B_Consumption) as AvgConsumption
  FROM Customer c
  INNER JOIN ServiceConnection sc ON c.C_ID = sc.C_ID
  INNER JOIN Meter m ON sc.M_ID = m.M_ID
  INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
  INNER JOIN Bill b ON m.M_ID = b.M_ID
  WHERE b.B_Status IN ('Paid', 'Unpaid', 'Partially Paid')
  GROUP BY c.C_ID, c.C_Name, c.C_Type, u.Ut_Name, u.Ut_Unit
)
SELECT
  ROW_NUMBER() OVER (PARTITION BY UtilityType ORDER BY TotalConsumption DESC) as Rank,
  CustomerId,
  CustomerName,
  CustomerType,
  UtilityType,
  Unit,
  TotalConsumption,
  BillCount,
  TotalAmount,
  AvgConsumption
FROM ConsumptionSummary;
GO
