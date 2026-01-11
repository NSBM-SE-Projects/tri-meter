import { getPool } from '../config/database.js';
import sql from 'mssql';

// Helper function to format date to short format
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper function to format month-year
function formatMonth(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// GET /api/meter-readings
export const getAllMeterReadings = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .query(`
        SELECT
          mr.R_ID as id,
          m.M_ID as meterId,
          m.M_Number as meterNumber,
          mr.R_Date as date,
          mr.R_Value as value,
          mr.R_Consumption as consumption,
          mr.R_IsTampered as tampered,
          mr.R_Notes as notes,
          u.U_FullName as fieldOfficer,
          ut.Ut_Name as utilityType,
          ut.Ut_Unit as unit,
          c.C_Name as customerName,
          c.C_ID as customerId,
          LAG(mr.R_Value) OVER (PARTITION BY m.M_ID ORDER BY mr.R_Date) as previousValue
        FROM MeterReading mr
        INNER JOIN Meter m ON mr.M_ID = m.M_ID
        INNER JOIN [User] u ON mr.U_ID = u.U_ID
        INNER JOIN Utility ut ON m.Ut_ID = ut.Ut_ID
        INNER JOIN ServiceConnection sc ON m.M_ID = sc.M_ID
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        ORDER BY mr.R_ID DESC
      `);

    // Map readings using database values
    const readings = result.recordset.map(reading => {
      const consumptionDisplay = `${reading.consumption}${reading.unit}`;

      return {
        id: reading.id,
        meterId: reading.meterId,
        meterNumber: reading.meterNumber,
        date: formatDate(reading.date),
        value: reading.value.toString(),
        previousValue: (reading.previousValue || 0).toString(),
        consumption: consumptionDisplay,
        tampered: reading.tampered,
        notes: reading.notes,
        fieldOfficer: reading.fieldOfficer,
        utilityType: reading.utilityType,
        month: formatMonth(reading.date),
        customerName: reading.customerName,
        customerId: reading.customerId
      };
    });

    res.status(200).json({
      success: true,
      data: readings
    });

  } catch (error) {
    console.error('GET ALL METER READINGS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meter readings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/meter-readings/:id
export const getMeterReadingById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool.request()
      .input('readingId', sql.Int, id)
      .query(`
        SELECT
          mr.R_ID as id,
          mr.M_ID as meterId,
          m.M_Number as meterNumber,
          mr.R_Date as date,
          mr.R_Value as value,
          mr.R_Consumption as consumption,
          mr.R_IsTampered as tampered,
          mr.R_TamperingFine as tamperingFine,
          mr.R_Notes as notes,
          mr.U_ID as fieldOfficerId,
          u.U_FullName as fieldOfficer,
          ut.Ut_Name as utilityType,
          ut.Ut_Unit as unit,
          c.C_Name as customerName,
          c.C_ID as customerId
        FROM MeterReading mr
        INNER JOIN Meter m ON mr.M_ID = m.M_ID
        INNER JOIN [User] u ON mr.U_ID = u.U_ID
        INNER JOIN Utility ut ON m.Ut_ID = ut.Ut_ID
        INNER JOIN ServiceConnection sc ON m.M_ID = sc.M_ID
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        WHERE mr.R_ID = @readingId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meter reading not found'
      });
    }

    const reading = result.recordset[0];

    // Get previous reading for the same meter
    const previousResult = await pool.request()
      .input('meterId', sql.Int, reading.meterId)
      .input('currentDate', sql.Date, reading.date)
      .query(`
        SELECT TOP 1 R_Value as value
        FROM MeterReading
        WHERE M_ID = @meterId AND R_Date < @currentDate
        ORDER BY R_Date DESC
      `);

    const previousValue = previousResult.recordset.length > 0
      ? previousResult.recordset[0].value
      : 0;

    res.status(200).json({
      success: true,
      data: {
        id: reading.id,
        meterId: reading.meterId,
        meterNumber: reading.meterNumber,
        date: reading.date,
        value: reading.value,
        previousValue: previousValue,
        consumption: reading.value - previousValue,
        tampered: reading.tampered,
        tamperingFine: reading.tamperingFine,
        notes: reading.notes,
        fieldOfficerId: reading.fieldOfficerId,
        fieldOfficer: reading.fieldOfficer,
        utilityType: reading.utilityType,
        unit: reading.unit,
        customerName: reading.customerName,
        customerId: reading.customerId
      }
    });

  } catch (error) {
    console.error('GET METER READING BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meter reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/meter-readings
export const createMeterReading = async (req, res) => {
  try {
    const {
      meterId,
      readingValue,
      readingDate,
      isTampered,
      notes
    } = req.body;

    // Validation
    if (!meterId || !readingValue || !readingDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: meterId, readingValue, readingDate'
      });
    }

    const pool = await getPool();

    // Get the logged-in user ID from the JWT token
    const fieldOfficerId = req.user.userId;

    // Get previous reading for consumption calculation
    const previousResult = await pool.request()
      .input('meterId', sql.Int, meterId)
      .input('currentDate', sql.Date, readingDate)
      .query(`
        SELECT TOP 1 R_Value as value
        FROM MeterReading
        WHERE M_ID = @meterId AND R_Date < @currentDate
        ORDER BY R_Date DESC
      `);

    const previousValue = previousResult.recordset.length > 0
      ? previousResult.recordset[0].value
      : 0;

    const consumption = parseFloat(readingValue) - parseFloat(previousValue);

    // Convert isTampered to boolean (handles both boolean and string values)
    const tampered = isTampered === true || isTampered === 'true';

    // Create meter reading
    const result = await pool.request()
      .input('meterId', sql.Int, meterId)
      .input('userId', sql.Int, fieldOfficerId)
      .input('date', sql.Date, readingDate)
      .input('value', sql.Decimal(10, 2), readingValue)
      .input('consumption', sql.Decimal(10, 2), consumption)
      .input('isTampered', sql.Bit, tampered ? 1 : 0)
      .input('tamperingFine', sql.Decimal(10, 2), tampered ? 500.00 : 0.00)
      .input('notes', sql.NVarChar(sql.MAX), notes || null)
      .query(`
        INSERT INTO MeterReading (M_ID, U_ID, R_Date, R_Value, R_Consumption, R_IsTampered, R_TamperingFine, R_Notes)
        VALUES (@meterId, @userId, @date, @value, @consumption, @isTampered, @tamperingFine, @notes);
        SELECT SCOPE_IDENTITY() AS R_ID;
      `);

    const readingId = result.recordset[0].R_ID;

    // Fetch the created reading
    const newReading = await pool.request()
      .input('readingId', sql.Int, readingId)
      .query(`
        SELECT
          mr.R_ID as id,
          m.M_Number as meterNumber,
          mr.R_Date as date,
          mr.R_Value as value,
          mr.R_Consumption as consumption,
          mr.R_IsTampered as tampered,
          u.U_FullName as fieldOfficer,
          ut.Ut_Name as utilityType,
          ut.Ut_Unit as unit,
          c.C_Name as customerName
        FROM MeterReading mr
        INNER JOIN Meter m ON mr.M_ID = m.M_ID
        INNER JOIN [User] u ON mr.U_ID = u.U_ID
        INNER JOIN Utility ut ON m.Ut_ID = ut.Ut_ID
        INNER JOIN ServiceConnection sc ON m.M_ID = sc.M_ID
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        WHERE mr.R_ID = @readingId
      `);

    const reading = newReading.recordset[0];

    res.status(201).json({
      success: true,
      message: 'Meter reading created successfully!',
      data: {
        id: reading.id,
        meterNumber: reading.meterNumber,
        date: formatDate(reading.date),
        value: reading.value.toString(),
        previousValue: previousValue.toString(),
        consumption: `${consumption}${reading.unit}`,
        tampered: reading.tampered,
        fieldOfficer: reading.fieldOfficer,
        utilityType: reading.utilityType,
        month: formatMonth(reading.date),
        customerName: reading.customerName
      }
    });

  } catch (error) {
    console.error('CREATE METER READING ERROR:', error);

    // Check for duplicate reading error
    if (error.number === 2627 || error.message?.includes('UQ_R_Details')) {
      return res.status(400).json({
        success: false,
        message: 'A reading for this meter already exists for the selected date. Please choose a different date or update the existing reading.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create meter reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /api/meter-readings/:id
export const updateMeterReading = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      readingValue,
      readingDate,
      isTampered,
      notes
    } = req.body;

    const pool = await getPool();

    // Check if reading exists
    const readingCheck = await pool.request()
      .input('readingId', sql.Int, id)
      .query('SELECT R_ID, M_ID FROM MeterReading WHERE R_ID = @readingId');

    if (readingCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meter reading not found'
      });
    }

    const meterId = readingCheck.recordset[0].M_ID;

    // Get previous reading for consumption calculation
    const previousResult = await pool.request()
      .input('meterId', sql.Int, meterId)
      .input('currentDate', sql.Date, readingDate)
      .input('readingId', sql.Int, id)
      .query(`
        SELECT TOP 1 R_Value as value
        FROM MeterReading
        WHERE M_ID = @meterId
          AND R_Date < @currentDate
          AND R_ID != @readingId
        ORDER BY R_Date DESC
      `);

    const previousValue = previousResult.recordset.length > 0
      ? previousResult.recordset[0].value
      : 0;

    const consumption = parseFloat(readingValue) - parseFloat(previousValue);

    // Convert isTampered to boolean (handles both boolean and string values)
    const tampered = isTampered === true || isTampered === 'true';

    // Update meter reading
    await pool.request()
      .input('readingId', sql.Int, id)
      .input('value', sql.Decimal(10, 2), readingValue)
      .input('date', sql.Date, readingDate)
      .input('consumption', sql.Decimal(10, 2), consumption)
      .input('isTampered', sql.Bit, tampered ? 1 : 0)
      .input('tamperingFine', sql.Decimal(10, 2), tampered ? 500.00 : 0.00)
      .input('notes', sql.NVarChar(sql.MAX), notes || null)
      .query(`
        UPDATE MeterReading
        SET R_Value = @value,
            R_Date = @date,
            R_Consumption = @consumption,
            R_IsTampered = @isTampered,
            R_TamperingFine = @tamperingFine,
            R_Notes = @notes
        WHERE R_ID = @readingId
      `);

    // Fetch updated reading
    const updatedReading = await pool.request()
      .input('readingId', sql.Int, id)
      .query(`
        SELECT
          mr.R_ID as id,
          m.M_Number as meterNumber,
          mr.R_Date as date,
          mr.R_Value as value,
          mr.R_Consumption as consumption,
          mr.R_IsTampered as tampered,
          u.U_FullName as fieldOfficer,
          ut.Ut_Name as utilityType,
          ut.Ut_Unit as unit,
          c.C_Name as customerName
        FROM MeterReading mr
        INNER JOIN Meter m ON mr.M_ID = m.M_ID
        INNER JOIN [User] u ON mr.U_ID = u.U_ID
        INNER JOIN Utility ut ON m.Ut_ID = ut.Ut_ID
        INNER JOIN ServiceConnection sc ON m.M_ID = sc.M_ID
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        WHERE mr.R_ID = @readingId
      `);

    const reading = updatedReading.recordset[0];

    res.status(200).json({
      success: true,
      message: 'Meter reading updated successfully!',
      data: {
        id: reading.id,
        meterNumber: reading.meterNumber,
        date: formatDate(reading.date),
        value: reading.value.toString(),
        previousValue: previousValue.toString(),
        consumption: `${reading.consumption}${reading.unit}`,
        tampered: reading.tampered,
        fieldOfficer: reading.fieldOfficer,
        utilityType: reading.utilityType,
        month: formatMonth(reading.date),
        customerName: reading.customerName
      }
    });

  } catch (error) {
    console.error('UPDATE METER READING ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update meter reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE /api/meter-readings/:id
export const deleteMeterReading = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    // Check if reading exists
    const readingCheck = await pool.request()
      .input('readingId', sql.Int, id)
      .query('SELECT R_ID FROM MeterReading WHERE R_ID = @readingId');

    if (readingCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meter reading not found'
      });
    }

    // Delete meter reading
    await pool.request()
      .input('readingId', sql.Int, id)
      .query('DELETE FROM MeterReading WHERE R_ID = @readingId');

    res.status(200).json({
      success: true,
      message: 'Meter reading deleted successfully'
    });

  } catch (error) {
    console.error('DELETE METER READING ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meter reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/meter-readings/latest/:meterId - Get latest reading for a meter
export const getLatestMeterReading = async (req, res) => {
  try {
    const { meterId } = req.params;
    const pool = await getPool();

    const result = await pool.request()
      .input('meterId', sql.Int, meterId)
      .query(`
        SELECT TOP 1
          R_Value as value,
          R_Date as date
        FROM MeterReading
        WHERE M_ID = @meterId
        ORDER BY R_Date DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('GET LATEST METER READING ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest meter reading',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/meter-readings/meters/active - Get all active meters for dropdown
export const getActiveMeters = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .query(`
        SELECT
          m.M_ID as id,
          m.M_Number as meterNumber,
          ut.Ut_Name as utilityType,
          ut.Ut_Unit as unit,
          c.C_Name as customerName,
          c.C_ID as customerId
        FROM Meter m
        INNER JOIN Utility ut ON m.Ut_ID = ut.Ut_ID
        INNER JOIN ServiceConnection sc ON m.M_ID = sc.M_ID
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        WHERE m.M_Status = 'Active' AND sc.S_Status = 'Active'
        ORDER BY m.M_Number
      `);

    const meters = result.recordset.map(meter => ({
      id: meter.id,
      meterNumber: meter.meterNumber,
      utilityType: meter.utilityType,
      unit: meter.unit,
      customerName: meter.customerName,
      customerId: meter.customerId
    }));

    res.status(200).json({
      success: true,
      data: meters
    });

  } catch (error) {
    console.error('GET ACTIVE METERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active meters',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
