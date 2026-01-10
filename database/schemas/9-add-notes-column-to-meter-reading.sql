-- Migration: Add Notes column to MeterReading table

-- Add R_Notes column to MeterReading table
ALTER TABLE MeterReading
ADD R_Notes TEXT NULL;
GO

PRINT 'Added R_Notes';
GO
