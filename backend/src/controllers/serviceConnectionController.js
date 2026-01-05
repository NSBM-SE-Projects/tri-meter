import { getPool } from '../config/database.js';
import sql from 'mssql';

// GET /api/service-connections

export const getAllServiceConnections = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .query(`
        SELECT
          sc.S_ID as id,
          c.C_Name as customerName,
          u.Ut_Name as utilityType,
          m.M_Number as meterNumber,
          m.M_InstallationDate as installationDate,
          t.T_CustomerType as tariffPlan,
          sc.S_Status as status,
          sc.S_ConnectionDate as connectionDate,
          t.T_InstallationCharge as installationCharge,
          c.C_ID as customerId,
          m.M_ID as meterId,
          t.T_ID as tariffId,
          ISNULL(sa.A_HouseNo, ca.A_HouseNo) as serviceHouseNo,
          ISNULL(sa.A_Street, ca.A_Street) as serviceStreet,
          ISNULL(sa.A_City, ca.A_City) as serviceCity
        FROM ServiceConnection sc
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        INNER JOIN Address ca ON c.A_ID = ca.A_ID
        INNER JOIN Meter m ON sc.M_ID = m.M_ID
        INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
        INNER JOIN Tariff t ON sc.T_ID = t.T_ID
        LEFT JOIN Address sa ON sc.A_ID = sa.A_ID
        ORDER BY sc.S_ConnectionDate DESC
      `);

    // Format installation date
    const formattedData = result.recordset.map(connection => ({
      ...connection,
      installationDate: formatDate(connection.installationDate)
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('GET ALL SERVICE CONNECTIONS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service connections',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/service-connections/:id
export const getServiceConnectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool.request()
      .input('connectionId', sql.Int, id)
      .query(`
        SELECT
          sc.S_ID as id,
          c.C_Name as customerName,
          u.Ut_Name as utilityType,
          m.M_Number as meterNumber,
          m.M_InstallationDate as installationDate,
          t.T_CustomerType as tariffPlan,
          sc.S_Status as status,
          sc.S_ConnectionDate as connectionDate,
          t.T_InstallationCharge as installationCharge,
          c.C_ID as customerId,
          m.M_ID as meterId,
          t.T_ID as tariffId,
          ISNULL(sa.A_HouseNo, ca.A_HouseNo) as serviceHouseNo,
          ISNULL(sa.A_Street, ca.A_Street) as serviceStreet,
          ISNULL(sa.A_City, ca.A_City) as serviceCity
        FROM ServiceConnection sc
        INNER JOIN Customer c ON sc.C_ID = c.C_ID
        INNER JOIN Address ca ON c.A_ID = ca.A_ID
        INNER JOIN Meter m ON sc.M_ID = m.M_ID
        INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
        INNER JOIN Tariff t ON sc.T_ID = t.T_ID
        LEFT JOIN Address sa ON sc.A_ID = sa.A_ID
        WHERE sc.S_ID = @connectionId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service connection not found'
      });
    }

    const formattedData = {
      ...result.recordset[0],
      installationDate: formatDate(result.recordset[0].installationDate)
    };

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('GET SERVICE CONNECTION BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service connection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/service-connections
export const createServiceConnection = async (req, res) => {
  try {
    const {
      customerId,
      utilityType,
      meterNumber,
      initialReading,
      houseNo,
      street,
      city,
      status
    } = req.body;

    // Validation
    if (!customerId || !utilityType || !meterNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerId, utilityType, meterNumber'
      });
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      const customerResult = await transaction.request()
        .input('customerId', sql.Int, customerId)
        .query('SELECT C_ID, C_Type FROM Customer WHERE C_ID = @customerId');

      if (customerResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      const customerType = customerResult.recordset[0].C_Type;

      // Customer's default address
      const customerAddressResult = await transaction.request()
        .input('customerId', sql.Int, customerId)
        .query('SELECT A_ID FROM Customer WHERE C_ID = @customerId');

      const customerAddressId = customerAddressResult.recordset[0].A_ID;

      let serviceAddressId = null;

      if (houseNo && street && city) {
        const houseNoTrimmed = houseNo.trim();
        const streetTrimmed = street.trim();
        const cityTrimmed = city.trim();

        const addressCheck = await transaction.request()
          .input('houseNo', sql.VarChar(50), houseNoTrimmed)
          .input('street', sql.VarChar(100), streetTrimmed)
          .input('city', sql.VarChar(50), cityTrimmed)
          .query(`
            SELECT A_ID
            FROM Address
            WHERE UPPER(LTRIM(RTRIM(A_HouseNo))) = UPPER(LTRIM(RTRIM(@houseNo)))
              AND UPPER(LTRIM(RTRIM(A_Street))) = UPPER(LTRIM(RTRIM(@street)))
              AND UPPER(LTRIM(RTRIM(A_City))) = UPPER(LTRIM(RTRIM(@city)))
          `);

        if (addressCheck.recordset.length > 0) {
          serviceAddressId = addressCheck.recordset[0].A_ID;
        } else {
          const addressResult = await transaction.request()
            .input('houseNo', sql.VarChar(50), houseNoTrimmed)
            .input('street', sql.VarChar(100), streetTrimmed)
            .input('city', sql.VarChar(50), cityTrimmed)
            .query(`
              INSERT INTO Address (A_HouseNo, A_Street, A_City)
              OUTPUT INSERTED.A_ID
              VALUES (@houseNo, @street, @city)
            `);

          serviceAddressId = addressResult.recordset[0].A_ID;
        }
      }

      // Get utility ID
      const utilityResult = await transaction.request()
        .input('utilityName', sql.VarChar(20), utilityType)
        .query('SELECT Ut_ID FROM Utility WHERE Ut_Name = @utilityName');

      if (utilityResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Utility type not found'
        });
      }

      const utilityId = utilityResult.recordset[0].Ut_ID;

      // Check if meter exists, if not create it
      let meterId;
      const meterCheck = await transaction.request()
        .input('meterNumber', sql.VarChar(50), meterNumber)
        .query('SELECT M_ID, M_Status FROM Meter WHERE M_Number = @meterNumber');

      if (meterCheck.recordset.length > 0) {
        meterId = meterCheck.recordset[0].M_ID;
        const currentMeterStatus = meterCheck.recordset[0].M_Status;

        if (currentMeterStatus === 'Active') {
          const meterInUse = await transaction.request()
            .input('meterId', sql.Int, meterId)
            .query(`
              SELECT COUNT(*) as count
              FROM ServiceConnection
              WHERE M_ID = @meterId AND S_Status = 'Active'
            `);

          if (meterInUse.recordset[0].count > 0) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: 'Meter is already in use by another active service connection'
            });
          }
        }

        // Reactivate meter if disconnected
        if (currentMeterStatus === 'Disconnected') {
          await transaction.request()
            .input('meterId', sql.Int, meterId)
            .query('UPDATE Meter SET M_Status = \'Active\' WHERE M_ID = @meterId');
        }
      } else {
        // Create new meter
        const meterResult = await transaction.request()
          .input('utilityId', sql.Int, utilityId)
          .input('meterNumber', sql.VarChar(50), meterNumber)
          .query(`
            INSERT INTO Meter (Ut_ID, M_Number, M_InstallationDate, M_Status)
            OUTPUT INSERTED.M_ID
            VALUES (@utilityId, @meterNumber, GETDATE(), 'Active')
          `);

        meterId = meterResult.recordset[0].M_ID;
      }

      const tariffResult = await transaction.request()
        .input('utilityId', sql.Int, utilityId)
        .input('customerType', sql.VarChar(20), customerType)
        .query(`
          SELECT TOP 1 T_ID
          FROM Tariff
          WHERE Ut_ID = @utilityId
            AND T_CustomerType = @customerType
            AND T_ValidFrom <= GETDATE()
            AND (T_ValidTo IS NULL OR T_ValidTo >= GETDATE())
          ORDER BY T_ValidFrom DESC
        `);

      if (tariffResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'No valid tariff found for this customer type and utility'
        });
      }

      const tariffId = tariffResult.recordset[0].T_ID;

      const connectionStatus = status || 'Active';
      const finalServiceAddressId = serviceAddressId || customerAddressId;

      const connectionResult = await transaction.request()
        .input('customerId', sql.Int, customerId)
        .input('meterId', sql.Int, meterId)
        .input('tariffId', sql.Int, tariffId)
        .input('serviceAddressId', sql.Int, finalServiceAddressId)
        .input('status', sql.VarChar(20), connectionStatus)
        .query(`
          INSERT INTO ServiceConnection (C_ID, M_ID, T_ID, S_ConnectionDate, A_ID, S_Status)
          OUTPUT INSERTED.S_ID
          VALUES (@customerId, @meterId, @tariffId, GETDATE(), @serviceAddressId, @status)
        `);

      const connectionId = connectionResult.recordset[0].S_ID;

      if (initialReading !== undefined && initialReading !== null) {
        const userId = req.user?.userId; // JWT token contains userId

        await transaction.request()
          .input('meterId', sql.Int, meterId)
          .input('readingValue', sql.Decimal(10, 2), initialReading)
          .input('userId', sql.Int, userId)
          .query(`
            INSERT INTO MeterReading (M_ID, R_Date, R_Value, R_Consumption, U_ID)
            VALUES (@meterId, GETDATE(), @readingValue, 0, @userId)
          `);
      }

      await transaction.commit();

      // Fetch the created service connection
      const newConnection = await pool.request()
        .input('connectionId', sql.Int, connectionId)
        .query(`
          SELECT
            sc.S_ID as id,
            c.C_Name as customerName,
            u.Ut_Name as utilityType,
            m.M_Number as meterNumber,
            m.M_InstallationDate as installationDate,
            t.T_CustomerType as tariffPlan,
            sc.S_Status as status,
            sc.S_ConnectionDate as connectionDate,
            t.T_InstallationCharge as installationCharge,
            ISNULL(sa.A_HouseNo, ca.A_HouseNo) as serviceHouseNo,
            ISNULL(sa.A_Street, ca.A_Street) as serviceStreet,
            ISNULL(sa.A_City, ca.A_City) as serviceCity
          FROM ServiceConnection sc
          INNER JOIN Customer c ON sc.C_ID = c.C_ID
          INNER JOIN Address ca ON c.A_ID = ca.A_ID
          INNER JOIN Meter m ON sc.M_ID = m.M_ID
          INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
          INNER JOIN Tariff t ON sc.T_ID = t.T_ID
          LEFT JOIN Address sa ON sc.A_ID = sa.A_ID
          WHERE sc.S_ID = @connectionId
        `);

      const formattedData = {
        ...newConnection.recordset[0],
        installationDate: formatDate(newConnection.recordset[0].installationDate)
      };

      res.status(201).json({
        success: true,
        message: 'Service connection created successfully',
        data: formattedData
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('CREATE SERVICE CONNECTION ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service connection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /api/service-connections/:id
export const updateServiceConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { meterNumber, status } = req.body;

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Get current connection details
      const connectionCheck = await transaction.request()
        .input('connectionId', sql.Int, id)
        .query(`
          SELECT
            sc.S_ID,
            sc.M_ID,
            m.M_Number,
            m.Ut_ID
          FROM ServiceConnection sc
          INNER JOIN Meter m ON sc.M_ID = m.M_ID
          WHERE sc.S_ID = @connectionId
        `);

      if (connectionCheck.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Service connection not found'
        });
      }

      const currentConnection = connectionCheck.recordset[0];
      let newMeterId = currentConnection.M_ID;
      let updateFields = [];

      // Handle meter change
      if (meterNumber && meterNumber !== currentConnection.M_Number) {
        const newMeterCheck = await transaction.request()
          .input('meterNumber', sql.VarChar(50), meterNumber)
          .query('SELECT M_ID, M_Status FROM Meter WHERE M_Number = @meterNumber');

        if (newMeterCheck.recordset.length > 0) {
          const existingMeter = newMeterCheck.recordset[0];
          newMeterId = existingMeter.M_ID;

          if (existingMeter.M_Status === 'Active') {
            const meterInUseRequest = await transaction.request()
              .input('meterId', sql.Int, newMeterId)
              .input('connectionId', sql.Int, id);

            const meterInUse = await meterInUseRequest.query(`
              SELECT COUNT(*) as count
              FROM ServiceConnection
              WHERE M_ID = @meterId AND S_Status = 'Active' AND S_ID != @connectionId
            `);

            if (meterInUse.recordset[0].count > 0) {
              await transaction.rollback();
              return res.status(400).json({
                success: false,
                message: 'Meter is already in use by another active connection'
              });
            }
          }

          // Reactivate if disconnected
          if (existingMeter.M_Status === 'Disconnected') {
            await transaction.request()
              .input('meterId', sql.Int, newMeterId)
              .query("UPDATE Meter SET M_Status = 'Active' WHERE M_ID = @meterId");
          }
        } else {
          // Create new meter with correct utility type
          const createMeter = await transaction.request()
            .input('utilityId', sql.Int, currentConnection.Ut_ID)
            .input('meterNumber', sql.VarChar(50), meterNumber)
            .query(`
              INSERT INTO Meter (Ut_ID, M_Number, M_InstallationDate, M_Status)
              OUTPUT INSERTED.M_ID
              VALUES (@utilityId, @meterNumber, GETDATE(), 'Active')
            `);

          newMeterId = createMeter.recordset[0].M_ID;
        }

        // Disconnect old meter
        await transaction.request()
          .input('oldMeterId', sql.Int, currentConnection.M_ID)
          .query("UPDATE Meter SET M_Status = 'Disconnected' WHERE M_ID = @oldMeterId");

        updateFields.push('M_ID = @newMeterId');
      }

      // Handle status change
      if (status) {
        if (!['Active', 'Disconnected'].includes(status)) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be "Active" or "Disconnected"'
          });
        }
        updateFields.push('S_Status = @status');
      }

      // Update service connection
      if (updateFields.length > 0) {
        const updateQuery = `
          UPDATE ServiceConnection
          SET ${updateFields.join(', ')}
          WHERE S_ID = @connectionId
        `;

        const updateRequest = transaction.request()
          .input('connectionId', sql.Int, id);

        if (newMeterId !== currentConnection.M_ID) {
          updateRequest.input('newMeterId', sql.Int, newMeterId);
        }
        if (status) {
          updateRequest.input('status', sql.VarChar(20), status);
        }

        await updateRequest.query(updateQuery);
      }

      await transaction.commit();

      // Fetch updated service connection
      const updatedConnection = await pool.request()
        .input('connectionId', sql.Int, id)
        .query(`
          SELECT
            sc.S_ID as id,
            c.C_Name as customerName,
            u.Ut_Name as utilityType,
            m.M_Number as meterNumber,
            m.M_InstallationDate as installationDate,
            t.T_CustomerType as tariffPlan,
            sc.S_Status as status,
            sc.S_ConnectionDate as connectionDate,
            t.T_InstallationCharge as installationCharge,
            ISNULL(sa.A_HouseNo, ca.A_HouseNo) as serviceHouseNo,
            ISNULL(sa.A_Street, ca.A_Street) as serviceStreet,
            ISNULL(sa.A_City, ca.A_City) as serviceCity
          FROM ServiceConnection sc
          INNER JOIN Customer c ON sc.C_ID = c.C_ID
          INNER JOIN Address ca ON c.A_ID = ca.A_ID
          INNER JOIN Meter m ON sc.M_ID = m.M_ID
          INNER JOIN Utility u ON m.Ut_ID = u.Ut_ID
          INNER JOIN Tariff t ON sc.T_ID = t.T_ID
          LEFT JOIN Address sa ON sc.A_ID = sa.A_ID
          WHERE sc.S_ID = @connectionId
        `);

      const formattedData = {
        ...updatedConnection.recordset[0],
        installationDate: formatDate(updatedConnection.recordset[0].installationDate)
      };

      res.status(200).json({
        success: true,
        message: 'Service connection updated successfully',
        data: formattedData
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('UPDATE SERVICE CONNECTION ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service connection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE /api/service-connections/:id
export const deleteServiceConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const connectionCheck = await pool.request()
      .input('connectionId', sql.Int, id)
      .query('SELECT S_ID, M_ID FROM ServiceConnection WHERE S_ID = @connectionId');

    if (connectionCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service connection not found'
      });
    }

    const meterId = connectionCheck.recordset[0].M_ID;

    // Check for meter readings
    const readingCheck = await pool.request()
      .input('meterId', sql.Int, meterId)
      .query('SELECT COUNT(*) as count FROM MeterReading WHERE M_ID = @meterId');

    const readingCount = readingCheck.recordset[0].count;

    // Check for bills
    const billCheck = await pool.request()
      .input('meterId', sql.Int, meterId)
      .query('SELECT COUNT(*) as count FROM Bill WHERE M_ID = @meterId');

    const billCount = billCheck.recordset[0].count;

    // Prevent deletion if dependencies exist
    if (readingCount > 0 || billCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete service connection: ${readingCount} meter reading(s) and ${billCount} bill(s) exist. Disconnect the connection instead.`,
        details: {
          meterReadings: readingCount,
          bills: billCount
        }
      });
    }

    // Delete service connection
    await pool.request()
      .input('connectionId', sql.Int, id)
      .query('DELETE FROM ServiceConnection WHERE S_ID = @connectionId');

    res.status(200).json({
      success: true,
      message: 'Service connection deleted successfully'
    });

  } catch (error) {
    console.error('DELETE SERVICE CONNECTION ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service connection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to format date
function formatDate(date) {
  if (!date) return '';

  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();

  // Add ordinal suffix
  const suffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}
