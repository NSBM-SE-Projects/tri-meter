import { getPool } from '../config/database.js';
import sql from 'mssql';
import azureBlobService from '../services/azureBlobService.js';
import sharp from 'sharp';

// Image compression helper
async function compressImage(buffer) {
  try {
    return await sharp(buffer)
      .resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error('IMAGE COMPRESSION ERROR:', error);
    return buffer;
  }
}

// GET /api/customers
export const getAllCustomers = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .query(`
        SELECT
          c.C_ID as id,
          c.C_Name as name,
          c.C_Type as type,
          c.C_Email as email,
          c.C_IDProof as idProof,
          c.C_IdImageUrl as idImageUrl,
          c.C_Status as status,
          c.C_RegistrationDate as registrationDate,
          a.A_HouseNo as houseNo,
          a.A_Street as street,
          a.A_City as city,
          STRING_AGG(cp.C_PhoneNo, ', ') as phones,
          (SELECT TOP 1 C_PhoneNo FROM CustomerPhone WHERE C_ID = c.C_ID ORDER BY C_PhoneNo) as phone
        FROM Customer c
        INNER JOIN Address a ON c.A_ID = a.A_ID
        LEFT JOIN CustomerPhone cp ON c.C_ID = cp.C_ID
        GROUP BY c.C_ID, c.C_Name, c.C_Type, c.C_Email, c.C_IDProof, c.C_IdImageUrl, c.C_Status, c.C_RegistrationDate, a.A_HouseNo, a.A_Street, a.A_City
        ORDER BY c.C_RegistrationDate DESC
      `);

    res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error('GET ALL CUSTOMERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool.request()
      .input('customerId', sql.Int, id)
      .query(`
        SELECT
          c.C_ID as id,
          c.C_Name as name,
          c.C_Type as type,
          c.C_Email as email,
          c.C_IDProof as idProof,
          c.C_IdImageUrl as idImageUrl,
          c.C_Status as status,
          c.C_RegistrationDate as registrationDate,
          a.A_HouseNo as houseNo,
          a.A_Street as street,
          a.A_City as city,
          STRING_AGG(cp.C_PhoneNo, ', ') as phones,
          (SELECT TOP 1 C_PhoneNo FROM CustomerPhone WHERE C_ID = c.C_ID ORDER BY C_PhoneNo) as phone
        FROM Customer c
        INNER JOIN Address a ON c.A_ID = a.A_ID
        LEFT JOIN CustomerPhone cp ON c.C_ID = cp.C_ID
        WHERE c.C_ID = @customerId
        GROUP BY c.C_ID, c.C_Name, c.C_Type, c.C_Email, c.C_IDProof, c.C_IdImageUrl, c.C_Status, c.C_RegistrationDate, a.A_HouseNo, a.A_Street, a.A_City
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('GET CUSTOMER BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const {
      fullName,
      customerType,
      identityValidation,
      phone,
      phone2,
      email,
      houseNo,
      street,
      city
    } = req.body;

    // Validation
    if (!fullName || !customerType || !identityValidation || !phone || !houseNo || !street || !city) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    let idImageUrl = null;
    if (req.file && azureBlobService.isReady()) {
      try {
        // Initialize container
        await azureBlobService.initializeContainer();

        // Compress image before upload
        const compressedBuffer = await compressImage(req.file.buffer);

        // Upload compressed image (force .jpg extension)
        idImageUrl = await azureBlobService.uploadFile(
          compressedBuffer,
          identityValidation,
          req.file.originalname.replace(/\.[^.]+$/, '.jpg'),
          'image/jpeg'
        );
      } catch (uploadError) {
        console.error('FILE UPLOAD ERROR:', uploadError);
      }
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // 1. Check if address exists, if not create it
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

      let addressId;

      if (addressCheck.recordset.length > 0) {
        addressId = addressCheck.recordset[0].A_ID;
      } else {
        // Create new address
        const addressResult = await transaction.request()
          .input('houseNo', sql.VarChar(50), houseNo)
          .input('street', sql.VarChar(100), street)
          .input('city', sql.VarChar(50), city)
          .query(`
            INSERT INTO Address (A_HouseNo, A_Street, A_City)
            OUTPUT INSERTED.A_ID
            VALUES (@houseNo, @street, @city)
          `);

        addressId = addressResult.recordset[0].A_ID;
      }

      // 2. Create customer
      const customerResult = await transaction.request()
        .input('name', sql.VarChar(100), fullName)
        .input('type', sql.VarChar(20), customerType)
        .input('addressId', sql.Int, addressId)
        .input('email', sql.VarChar(100), email || null)
        .input('idProof', sql.VarChar(50), identityValidation)
        .input('idImageUrl', sql.VarChar(500), idImageUrl)
        .query(`
          INSERT INTO Customer (C_Name, C_Type, A_ID, C_Email, C_IDProof, C_IdImageUrl, C_RegistrationDate, C_Status)
          OUTPUT INSERTED.C_ID
          VALUES (@name, @type, @addressId, @email, @idProof, @idImageUrl, GETDATE(), 'Active')
        `);

      const customerId = customerResult.recordset[0].C_ID;

      // 3. Add phone numbers
      await transaction.request()
        .input('customerId', sql.Int, customerId)
        .input('phone', sql.VarChar(20), phone)
        .query(`
          INSERT INTO CustomerPhone (C_ID, C_PhoneNo)
          VALUES (@customerId, @phone)
        `);

      // Add secondary phone
      if (phone2 && phone2.trim()) {
        await transaction.request()
          .input('customerId', sql.Int, customerId)
          .input('phone2', sql.VarChar(20), phone2)
          .query(`
            INSERT INTO CustomerPhone (C_ID, C_PhoneNo)
            VALUES (@customerId, @phone2)
          `);
      }

      await transaction.commit();

      // Fetch the created customer
      const newCustomer = await pool.request()
        .input('customerId', sql.Int, customerId)
        .query(`
          SELECT
            c.C_ID as id,
            c.C_Name as name,
            c.C_Type as type,
            c.C_Email as email,
            c.C_IDProof as idProof,
            c.C_IdImageUrl as idImageUrl,
            c.C_Status as status,
            c.C_RegistrationDate as registrationDate,
            a.A_HouseNo as houseNo,
            a.A_Street as street,
            a.A_City as city,
            STRING_AGG(cp.C_PhoneNo, ', ') as phones,
            (SELECT TOP 1 C_PhoneNo FROM CustomerPhone WHERE C_ID = c.C_ID ORDER BY C_PhoneNo) as phone
          FROM Customer c
          INNER JOIN Address a ON c.A_ID = a.A_ID
          LEFT JOIN CustomerPhone cp ON c.C_ID = cp.C_ID
          WHERE c.C_ID = @customerId
          GROUP BY c.C_ID, c.C_Name, c.C_Type, c.C_Email, c.C_IDProof, c.C_IdImageUrl, c.C_Status, c.C_RegistrationDate, a.A_HouseNo, a.A_Street, a.A_City
        `);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully!',
        data: newCustomer.recordset[0]
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('CREATE CUSTOMER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  
  try {
    const { id } = req.params;
    const {
      fullName,
      customerType,
      identityValidation,
      phone,
      phone2,
      email,
      houseNo,
      street,
      city,
      status
    } = req.body;

    let idImageUrl = null;
    if (req.file && azureBlobService.isReady()) {
      try {
        await azureBlobService.initializeContainer();

        const compressedBuffer = await compressImage(req.file.buffer);

        idImageUrl = await azureBlobService.uploadFile(
          compressedBuffer,
          identityValidation,
          req.file.originalname.replace(/\.[^.]+$/, '.jpg'), // Change extension to .jpg
          'image/jpeg'
        );
      } catch (uploadError) {
        console.error('FILE UPLOAD ERROR:', uploadError);
      }
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      const customerCheck = await transaction.request()
        .input('customerId', sql.Int, id)
        .query('SELECT C_ID, A_ID, C_IdImageUrl FROM Customer WHERE C_ID = @customerId');

      const oldImageUrl = customerCheck.recordset.length > 0 ? customerCheck.recordset[0].C_IdImageUrl : null;

      if (customerCheck.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      const currentAddressId = customerCheck.recordset[0].A_ID;

      // 2. Handle address update
      let addressId = currentAddressId;

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
          addressId = addressCheck.recordset[0].A_ID;
        } else {
          await transaction.request()
            .input('addressId', sql.Int, currentAddressId)
            .input('houseNo', sql.VarChar(50), houseNo)
            .input('street', sql.VarChar(100), street)
            .input('city', sql.VarChar(50), city)
            .query(`
              UPDATE Address
              SET A_HouseNo = @houseNo,
                  A_Street = @street,
                  A_City = @city
              WHERE A_ID = @addressId
            `);

          addressId = currentAddressId;
        }
      }

      // 3. Update customer (with optional new ID image URL)
      const updateRequest = transaction.request()
        .input('customerId', sql.Int, id)
        .input('name', sql.VarChar(100), fullName)
        .input('type', sql.VarChar(20), customerType)
        .input('addressId', sql.Int, addressId)
        .input('email', sql.VarChar(100), email || null)
        .input('idProof', sql.VarChar(50), identityValidation)
        .input('status', sql.VarChar(20), status || "Active");

      if (idImageUrl) {
        updateRequest.input('idImageUrl', sql.VarChar(500), idImageUrl);
        await updateRequest.query(`
          UPDATE Customer
          SET C_Name = @name,
              C_Type = @type,
              A_ID = @addressId,
              C_Email = @email,
              C_IDProof = @idProof,
              C_IdImageUrl = @idImageUrl,
              C_Status = @status
          WHERE C_ID = @customerId
        `);
      } else {
        await updateRequest.query(`
          UPDATE Customer
          SET C_Name = @name,
              C_Type = @type,
              A_ID = @addressId,
              C_Email = @email,
              C_IDProof = @idProof,
              C_Status = @status
          WHERE C_ID = @customerId
        `);
      }

      // 4. Update phone numbers
      if (phone) {
        // Delete all existing phone numbers
        await transaction.request()
          .input('customerId', sql.Int, id)
          .query('DELETE FROM CustomerPhone WHERE C_ID = @customerId');

        // Insert primary phone
        await transaction.request()
          .input('customerId', sql.Int, id)
          .input('phone', sql.VarChar(20), phone)
          .query(`
            INSERT INTO CustomerPhone (C_ID, C_PhoneNo)
            VALUES (@customerId, @phone)
          `);

        // Insert secondary phone
        if (phone2 && phone2.trim()) {
          await transaction.request()
            .input('customerId', sql.Int, id)
            .input('phone2', sql.VarChar(20), phone2)
            .query(`
              INSERT INTO CustomerPhone (C_ID, C_PhoneNo)
              VALUES (@customerId, @phone2)
            `);
        }
      }

      await transaction.commit();

      // Fetch updated customer
      const updatedCustomer = await pool.request()
        .input('customerId', sql.Int, id)
        .query(`
          SELECT
            c.C_ID as id,
            c.C_Name as name,
            c.C_Type as type,
            c.C_Email as email,
            c.C_IDProof as idProof,
            c.C_IdImageUrl as idImageUrl,
            c.C_Status as status,
            c.C_RegistrationDate as registrationDate,
            a.A_HouseNo as houseNo,
            a.A_Street as street,
            a.A_City as city,
            STRING_AGG(cp.C_PhoneNo, ', ') as phones,
            (SELECT TOP 1 C_PhoneNo FROM CustomerPhone WHERE C_ID = c.C_ID ORDER BY C_PhoneNo) as phone
          FROM Customer c
          INNER JOIN Address a ON c.A_ID = a.A_ID
          LEFT JOIN CustomerPhone cp ON c.C_ID = cp.C_ID
          WHERE c.C_ID = @customerId
          GROUP BY c.C_ID, c.C_Name, c.C_Type, c.C_Email, c.C_IDProof, c.C_IdImageUrl, c.C_Status, c.C_RegistrationDate, a.A_HouseNo, a.A_Street, a.A_City
        `);

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully!',
        data: updatedCustomer.recordset[0]
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('UPDATE CUSTOMER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    // Check if customer exists
    const customerCheck = await pool.request()
      .input('customerId', sql.Int, id)
      .query('SELECT C_ID FROM Customer WHERE C_ID = @customerId');

    if (customerCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Delete customer (CASCADE will handle CustomerPhone)
    await pool.request()
      .input('customerId', sql.Int, id)
      .query('DELETE FROM Customer WHERE C_ID = @customerId');

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('DELETE CUSTOMER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
