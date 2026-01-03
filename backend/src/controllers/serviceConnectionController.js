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
          sc.S_InitialReading as initialReading,
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
          sc.S_InitialReading as initialReading,
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
      customer,
      utilityType,
      meterNumber,
      initialReading,
      houseNo,
      street,
      city,
      status
    } = req.body;

    // Validation
    if (!customer || !utilityType || !meterNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Get customer ID by name
      const customerResult = await transaction.request()
        .input('customerName', sql.VarChar(100), customer)
        .query('SELECT C_ID FROM Customer WHERE C_Name = @customerName');

      if (customerResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      const customerId = customerResult.recordset[0].C_ID;

      // Customer's default address
      const customerAddressResult = await transaction.request()
        .input('customerId', sql.Int, customerId)
        .query('SELECT A_ID FROM Customer WHERE C_ID = @customerId');

      const customerAddressId = customerAddressResult.recordset[0].A_ID;

      // Check
      let serviceAddressId = null;

      if (houseNo && street && city) {
        const addressCheck = await transaction.request()
          .input('houseNo', sql.VarChar(50), houseNo)
          .input('street', sql.VarChar(100), street)
          .input('city', sql.VarChar(50), city)
          .query(`
            SELECT A_ID
            FROM Address
            WHERE A_HouseNo = @houseNo
              AND A_Street = @street
              AND A_City = @city
          `);

        if (addressCheck.recordset.length > 0) {
          serviceAddressId = addressCheck.recordset[0].A_ID;
        } else {
          const addressResult = await transaction.request()
            .input('houseNo', sql.VarChar(50), houseNo)
            .input('street', sql.VarChar(100), street)
            .input('city', sql.VarChar(50), city)
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

        // Update meter if existing
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

      // Get customer type to find appropriate tariff
      const customerTypeResult = await transaction.request()
        .input('customerId', sql.Int, customerId)
        .query('SELECT C_Type FROM Customer WHERE C_ID = @customerId');

      const customerType = customerTypeResult.recordset[0].C_Type;

      // Find appropriate tariff
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

      // 6. Create service connection
      const connectionStatus = status || 'Active';

      const connectionResult = await transaction.request()
        .input('customerId', sql.Int, customerId)
        .input('meterId', sql.Int, meterId)
        .input('tariffId', sql.Int, tariffId)
        .input('initialReading', sql.Decimal(10, 2), initialReading || 0.00)
        .input('serviceAddressId', sql.Int, serviceAddressId)
        .input('status', sql.VarChar(20), connectionStatus)
        .query(`
          INSERT INTO ServiceConnection (C_ID, M_ID, T_ID, S_ConnectionDate, S_InitialReading, A_ID, S_Status)
          OUTPUT INSERTED.S_ID
          VALUES (@customerId, @meterId, @tariffId, GETDATE(), @initialReading, @serviceAddressId, @status)
        `);

      const connectionId = connectionResult.recordset[0].S_ID;

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
            sc.S_InitialReading as initialReading,
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
    const { status } = req.body;

    // Validate status if provided
    if (status && !['Active', 'Disconnected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "Active" or "Disconnected"'
      });
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Check if service connection exists
      const connectionCheck = await transaction.request()
        .input('connectionId', sql.Int, id)
        .query('SELECT S_ID FROM ServiceConnection WHERE S_ID = @connectionId');

      if (connectionCheck.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Service connection not found'
        });
      }

      // Update service connection
      await transaction.request()
        .input('connectionId', sql.Int, id)
        .input('status', sql.VarChar(20), status)
        .query(`
          UPDATE ServiceConnection
          SET S_Status = ISNULL(@status, S_Status)
          WHERE S_ID = @connectionId
        `);

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
            sc.S_InitialReading as initialReading,
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

    // Check if service connection exists
    const connectionCheck = await pool.request()
      .input('connectionId', sql.Int, id)
      .query('SELECT S_ID FROM ServiceConnection WHERE S_ID = @connectionId');

    if (connectionCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service connection not found'
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
