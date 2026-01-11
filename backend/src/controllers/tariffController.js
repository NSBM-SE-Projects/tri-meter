import { getPool } from '../config/database.js';
import sql from 'mssql';

/**
 * GET /api/tariffs
 * Get all tariffs with optional utility filter
 */
export const getAllTariffs = async (req, res) => {
  try {
    const { utilityType } = req.query;
    const pool = await getPool();

    let query = `
      SELECT
        t.T_ID as id,
        t.T_CustomerType as planName,
        t.T_ValidFrom as validFrom,
        t.T_ValidTo as validTo,
        t.T_InstallationCharge as installationCharge,
        u.Ut_ID as utilityId,
        u.Ut_Name as utilityType
      FROM Tariff t
      INNER JOIN Utility u ON t.Ut_ID = u.Ut_ID
      WHERE 1=1
    `;

    const request = pool.request();

    if (utilityType && utilityType !== 'all') {
      query += ` AND u.Ut_Name = @utilityType`;
      request.input('utilityType', sql.VarChar(20), utilityType);
    }

    query += ` ORDER BY u.Ut_Name, t.T_ValidFrom DESC`;

    const result = await request.query(query);

    // For each tariff, get the utility-specific details
    const tariffs = await Promise.all(result.recordset.map(async (tariff) => {
      let details = {};

      if (tariff.utilityType === 'Electricity') {
        const electricityResult = await pool.request()
          .input('tariffId', sql.Int, tariff.id)
          .query(`
            SELECT E_Slab1Max, E_Slab1Rate, E_Slab2Max, E_Slab2Rate, E_Slab3Rate
            FROM ElectricityTariff
            WHERE E_T_ID = @tariffId
          `);

        if (electricityResult.recordset.length > 0) {
          const e = electricityResult.recordset[0];
          details = {
            slabs: 3,
            slab1Max: e.E_Slab1Max,
            slab1Rate: e.E_Slab1Rate,
            slab2Max: e.E_Slab2Max,
            slab2Rate: e.E_Slab2Rate,
            slab3Rate: e.E_Slab3Rate
          };
        }
      } else if (tariff.utilityType === 'Water') {
        const waterResult = await pool.request()
          .input('tariffId', sql.Int, tariff.id)
          .query(`
            SELECT W_FlatRate, W_FixedCharge
            FROM WaterTariff
            WHERE W_T_ID = @tariffId
          `);

        if (waterResult.recordset.length > 0) {
          const w = waterResult.recordset[0];
          details = {
            flatRate: w.W_FlatRate,
            fixedCharge: w.W_FixedCharge
          };
        }
      } else if (tariff.utilityType === 'Gas') {
        const gasResult = await pool.request()
          .input('tariffId', sql.Int, tariff.id)
          .query(`
            SELECT G_Slab1Max, G_Slab1Rate, G_Slab2Rate, G_SubsidyAmount
            FROM GasTariff
            WHERE G_T_ID = @tariffId
          `);

        if (gasResult.recordset.length > 0) {
          const g = gasResult.recordset[0];
          details = {
            slabs: 2,
            slab1Max: g.G_Slab1Max,
            slab1Rate: g.G_Slab1Rate,
            slab2Rate: g.G_Slab2Rate,
            subsidyAmount: g.G_SubsidyAmount
          };
        }
      }

      return {
        id: tariff.id,
        planName: tariff.planName,
        validFrom: formatDate(tariff.validFrom),
        validTo: tariff.validTo ? formatDate(tariff.validTo) : 'Present',
        validFromRaw: tariff.validFrom,
        validToRaw: tariff.validTo,
        installationCharge: tariff.installationCharge || 0,
        utilityType: tariff.utilityType,
        utilityId: tariff.utilityId,
        ...details
      };
    }));

    res.status(200).json({
      success: true,
      data: tariffs
    });

  } catch (error) {
    console.error('GET ALL TARIFFS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tariffs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/tariffs/:id
 * Get tariff by ID with full details
 */
export const getTariffById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const tariffResult = await pool.request()
      .input('tariffId', sql.Int, id)
      .query(`
        SELECT
          t.T_ID as id,
          t.T_CustomerType as planName,
          t.T_ValidFrom as validFrom,
          t.T_ValidTo as validTo,
          t.T_Description as description,
          t.T_InstallationCharge as installationCharge,
          u.Ut_ID as utilityId,
          u.Ut_Name as utilityType
        FROM Tariff t
        INNER JOIN Utility u ON t.Ut_ID = u.Ut_ID
        WHERE t.T_ID = @tariffId
      `);

    if (tariffResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tariff not found'
      });
    }

    const tariff = tariffResult.recordset[0];
    let details = {};

    if (tariff.utilityType === 'Electricity') {
      const electricityResult = await pool.request()
        .input('tariffId', sql.Int, id)
        .query(`
          SELECT E_Slab1Max, E_Slab1Rate, E_Slab2Max, E_Slab2Rate, E_Slab3Rate
          FROM ElectricityTariff
          WHERE E_T_ID = @tariffId
        `);

      if (electricityResult.recordset.length > 0) {
        const e = electricityResult.recordset[0];
        details = {
          slab1Max: e.E_Slab1Max,
          slab1Rate: e.E_Slab1Rate,
          slab2Max: e.E_Slab2Max,
          slab2Rate: e.E_Slab2Rate,
          slab3Rate: e.E_Slab3Rate
        };
      }
    } else if (tariff.utilityType === 'Water') {
      const waterResult = await pool.request()
        .input('tariffId', sql.Int, id)
        .query(`
          SELECT W_FlatRate, W_FixedCharge
          FROM WaterTariff
          WHERE W_T_ID = @tariffId
        `);

      if (waterResult.recordset.length > 0) {
        const w = waterResult.recordset[0];
        details = {
          flatRate: w.W_FlatRate,
          fixedCharge: w.W_FixedCharge
        };
      }
    } else if (tariff.utilityType === 'Gas') {
      const gasResult = await pool.request()
        .input('tariffId', sql.Int, id)
        .query(`
          SELECT G_Slab1Max, G_Slab1Rate, G_Slab2Rate, G_SubsidyAmount
          FROM GasTariff
          WHERE G_T_ID = @tariffId
        `);

      if (gasResult.recordset.length > 0) {
        const g = gasResult.recordset[0];
        details = {
          slab1Max: g.G_Slab1Max,
          slab1Rate: g.G_Slab1Rate,
          slab2Rate: g.G_Slab2Rate,
          subsidyAmount: g.G_SubsidyAmount
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        id: tariff.id,
        planName: tariff.planName,
        validFrom: tariff.validFrom,
        validTo: tariff.validTo,
        description: tariff.description,
        installationCharge: tariff.installationCharge || 0,
        utilityType: tariff.utilityType,
        utilityId: tariff.utilityId,
        ...details
      }
    });

  } catch (error) {
    console.error('GET TARIFF BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tariff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/tariffs
 * Create a new tariff
 */
export const createTariff = async (req, res) => {
  try {
    const {
      utilityType,
      planName,
      validFrom,
      validTo,
      description,
      installationCharge,
      // Electricity fields
      slab1Max,
      slab1Rate,
      slab2Max,
      slab2Rate,
      slab3Rate,
      // Water fields
      flatRate,
      fixedCharge,
      // Gas fields
      subsidyAmount
    } = req.body;

    // Validation
    if (!utilityType || !planName || !validFrom) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: utilityType, planName, validFrom'
      });
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Get utility ID
      const utilityResult = await transaction.request()
        .input('utilityName', sql.VarChar(20), utilityType)
        .query(`
          SELECT Ut_ID FROM Utility WHERE Ut_Name = @utilityName
        `);

      if (utilityResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Invalid utility type'
        });
      }

      const utilityId = utilityResult.recordset[0].Ut_ID;

      // Create main tariff record
      const tariffResult = await transaction.request()
        .input('utilityId', sql.Int, utilityId)
        .input('customerType', sql.VarChar(20), planName)
        .input('validFrom', sql.Date, validFrom)
        .input('validTo', sql.Date, validTo || null)
        .input('description', sql.Text, description || null)
        .input('installationCharge', sql.Decimal(10, 2), installationCharge || 0)
        .query(`
          DECLARE @InsertedTariff TABLE (T_ID INT)
          INSERT INTO Tariff (Ut_ID, T_CustomerType, T_ValidFrom, T_ValidTo, T_Description, T_InstallationCharge)
          OUTPUT INSERTED.T_ID INTO @InsertedTariff
          VALUES (@utilityId, @customerType, @validFrom, @validTo, @description, @installationCharge)
          SELECT T_ID FROM @InsertedTariff
        `);

      const tariffId = tariffResult.recordset[0].T_ID;

      // Create utility-specific tariff record
      if (utilityType === 'Electricity') {
        await transaction.request()
          .input('tariffId', sql.Int, tariffId)
          .input('slab1Max', sql.Int, slab1Max || 0)
          .input('slab1Rate', sql.Decimal(10, 2), slab1Rate || 0)
          .input('slab2Max', sql.Int, slab2Max || 0)
          .input('slab2Rate', sql.Decimal(10, 2), slab2Rate || 0)
          .input('slab3Rate', sql.Decimal(10, 2), slab3Rate || 0)
          .query(`
            INSERT INTO ElectricityTariff (E_T_ID, E_Slab1Max, E_Slab1Rate, E_Slab2Max, E_Slab2Rate, E_Slab3Rate)
            VALUES (@tariffId, @slab1Max, @slab1Rate, @slab2Max, @slab2Rate, @slab3Rate)
          `);
      } else if (utilityType === 'Water') {
        await transaction.request()
          .input('tariffId', sql.Int, tariffId)
          .input('flatRate', sql.Decimal(10, 2), flatRate || 0)
          .input('fixedCharge', sql.Decimal(10, 2), fixedCharge || 0)
          .query(`
            INSERT INTO WaterTariff (W_T_ID, W_FlatRate, W_FixedCharge)
            VALUES (@tariffId, @flatRate, @fixedCharge)
          `);
      } else if (utilityType === 'Gas') {
        await transaction.request()
          .input('tariffId', sql.Int, tariffId)
          .input('slab1Max', sql.Int, slab1Max || 0)
          .input('slab1Rate', sql.Decimal(10, 2), slab1Rate || 0)
          .input('slab2Rate', sql.Decimal(10, 2), slab2Rate || 0)
          .input('subsidyAmount', sql.Decimal(10, 2), subsidyAmount || 50.00)
          .query(`
            INSERT INTO GasTariff (G_T_ID, G_Slab1Max, G_Slab1Rate, G_Slab2Rate, G_SubsidyAmount)
            VALUES (@tariffId, @slab1Max, @slab1Rate, @slab2Rate, @subsidyAmount)
          `);
      }

      await transaction.commit();

      // Fetch the created tariff
      const newTariff = await pool.request()
        .input('tariffId', sql.Int, tariffId)
        .query(`
          SELECT
            t.T_ID as id,
            t.T_CustomerType as planName,
            t.T_ValidFrom as validFrom,
            u.Ut_Name as utilityType
          FROM Tariff t
          INNER JOIN Utility u ON t.Ut_ID = u.Ut_ID
          WHERE t.T_ID = @tariffId
        `);

      const tariff = newTariff.recordset[0];

      res.status(201).json({
        success: true,
        message: 'Tariff created successfully',
        data: {
          id: tariff.id,
          planName: tariff.planName,
          validFrom: formatDate(tariff.validFrom),
          utilityType: tariff.utilityType
        }
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('CREATE TARIFF ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tariff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * PUT /api/tariffs/:id
 * Update a tariff
 */
export const updateTariff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      planName,
      validFrom,
      validTo,
      description,
      installationCharge,
      // Electricity fields
      slab1Max,
      slab1Rate,
      slab2Max,
      slab2Rate,
      slab3Rate,
      // Water fields
      flatRate,
      fixedCharge,
      // Gas fields
      subsidyAmount
    } = req.body;

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Get tariff to determine utility type
      const tariffResult = await transaction.request()
        .input('tariffId', sql.Int, id)
        .query(`
          SELECT t.T_ID, u.Ut_Name as utilityType
          FROM Tariff t
          INNER JOIN Utility u ON t.Ut_ID = u.Ut_ID
          WHERE t.T_ID = @tariffId
        `);

      if (tariffResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Tariff not found'
        });
      }

      const utilityType = tariffResult.recordset[0].utilityType;

      // Update main tariff record
      await transaction.request()
        .input('tariffId', sql.Int, id)
        .input('customerType', sql.VarChar(20), planName)
        .input('validFrom', sql.Date, validFrom)
        .input('validTo', sql.Date, validTo || null)
        .input('description', sql.Text, description || null)
        .input('installationCharge', sql.Decimal(10, 2), installationCharge || 0)
        .query(`
          UPDATE Tariff
          SET T_CustomerType = @customerType,
              T_ValidFrom = @validFrom,
              T_ValidTo = @validTo,
              T_Description = @description,
              T_InstallationCharge = @installationCharge
          WHERE T_ID = @tariffId
        `);

      // Update utility-specific tariff record
      if (utilityType === 'Electricity') {
        await transaction.request()
          .input('tariffId', sql.Int, id)
          .input('slab1Max', sql.Int, slab1Max)
          .input('slab1Rate', sql.Decimal(10, 2), slab1Rate)
          .input('slab2Max', sql.Int, slab2Max)
          .input('slab2Rate', sql.Decimal(10, 2), slab2Rate)
          .input('slab3Rate', sql.Decimal(10, 2), slab3Rate)
          .query(`
            UPDATE ElectricityTariff
            SET E_Slab1Max = @slab1Max,
                E_Slab1Rate = @slab1Rate,
                E_Slab2Max = @slab2Max,
                E_Slab2Rate = @slab2Rate,
                E_Slab3Rate = @slab3Rate
            WHERE E_T_ID = @tariffId
          `);
      } else if (utilityType === 'Water') {
        await transaction.request()
          .input('tariffId', sql.Int, id)
          .input('flatRate', sql.Decimal(10, 2), flatRate)
          .input('fixedCharge', sql.Decimal(10, 2), fixedCharge)
          .query(`
            UPDATE WaterTariff
            SET W_FlatRate = @flatRate,
                W_FixedCharge = @fixedCharge
            WHERE W_T_ID = @tariffId
          `);
      } else if (utilityType === 'Gas') {
        await transaction.request()
          .input('tariffId', sql.Int, id)
          .input('slab1Max', sql.Int, slab1Max)
          .input('slab1Rate', sql.Decimal(10, 2), slab1Rate)
          .input('slab2Rate', sql.Decimal(10, 2), slab2Rate)
          .input('subsidyAmount', sql.Decimal(10, 2), subsidyAmount)
          .query(`
            UPDATE GasTariff
            SET G_Slab1Max = @slab1Max,
                G_Slab1Rate = @slab1Rate,
                G_Slab2Rate = @slab2Rate,
                G_SubsidyAmount = @subsidyAmount
            WHERE G_T_ID = @tariffId
          `);
      }

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: 'Tariff updated successfully'
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('UPDATE TARIFF ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tariff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * DELETE /api/tariffs/:id
 * Delete a tariff
 */
export const deleteTariff = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    // Check if tariff is being used by any service connection
    const usageCheck = await pool.request()
      .input('tariffId', sql.Int, id)
      .query(`
        SELECT COUNT(*) as count
        FROM ServiceConnection
        WHERE T_ID = @tariffId
      `);

    if (usageCheck.recordset[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tariff that is being used by service connections'
      });
    }

    // Delete tariff (will cascade delete utility-specific tariff due to ON DELETE CASCADE)
    await pool.request()
      .input('tariffId', sql.Int, id)
      .query(`
        DELETE FROM Tariff WHERE T_ID = @tariffId
      `);

    res.status(200).json({
      success: true,
      message: 'Tariff deleted successfully'
    });

  } catch (error) {
    console.error('DELETE TARIFF ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tariff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
