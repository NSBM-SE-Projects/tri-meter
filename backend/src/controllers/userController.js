import { getPool } from '../config/database.js';
import sql from 'mssql';
import bcrypt from 'bcrypt';
import azureBlobService from '../services/azureBlobService.js';
import sharp from 'sharp';

const SALT_ROUNDS = 10;

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

/**
 * GET /api/users
 * Get all system users with optional filters
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const pool = await getPool();

    let query = `
      SELECT
        u.U_ID as id,
        u.U_Username as username,
        u.U_FullName as fullName,
        u.U_Role as role,
        u.U_Email as email,
        u.U_Phone as phone,
        u.U_Status as status,
        u.U_RegistrationDate as registrationDate,
        u.U_ProfilePhoto as profilePhoto,
        u.U_IDCard as idCard,
        CONCAT_WS(', ', a.A_HouseNo, a.A_Street, a.A_City) as address,
        a.A_HouseNo as houseNo,
        a.A_Street as street,
        a.A_City as city
      FROM [User] u
      LEFT JOIN Address a ON u.A_ID = a.A_ID
      WHERE 1=1
    `;

    const request = pool.request();

    // Add filters
    if (role && role !== 'all') {
      query += ` AND u.U_Role = @role`;
      request.input('role', sql.VarChar(20), role);
    }

    if (status && status !== 'all') {
      query += ` AND u.U_Status = @status`;
      request.input('status', sql.VarChar(20), status);
    }

    if (search) {
      query += ` AND (u.U_FullName LIKE @search OR u.U_Username LIKE @search OR u.U_Email LIKE @search)`;
      request.input('search', sql.VarChar(100), `%${search}%`);
    }

    query += ` ORDER BY u.U_RegistrationDate DESC`;

    const result = await request.query(query);

    // Format the data for frontend
    const users = result.recordset.map(user => ({
      id: user.id,
      userId: `U-${String(user.id).padStart(3, '0')}`,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      phone: user.phone,
      status: user.status,
      registrationDate: formatDate(user.registrationDate),
      profilePhoto: user.profilePhoto,
      idCard: user.idCard,
      address: user.address,
      houseNo: user.houseNo,
      street: user.street,
      city: user.city
    }));

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('GET ALL USERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/users/:id
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.Int, id)
      .query(`
        SELECT
          u.U_ID as id,
          u.U_Username as username,
          u.U_FullName as fullName,
          u.U_Role as role,
          u.U_Email as email,
          u.U_Phone as phone,
          u.U_Status as status,
          u.U_RegistrationDate as registrationDate,
          u.U_ProfilePhoto as profilePhoto,
          u.U_IDCard as idCard,
          a.A_HouseNo as houseNo,
          a.A_Street as street,
          a.A_City as city
        FROM [User] u
        LEFT JOIN Address a ON u.A_ID = a.A_ID
        WHERE u.U_ID = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.recordset[0];

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        status: user.status,
        registrationDate: user.registrationDate,
        profilePhoto: user.profilePhoto,
        idCard: user.idCard,
        houseNo: user.houseNo,
        street: user.street,
        city: user.city
      }
    });

  } catch (error) {
    console.error('GET USER BY ID ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/users
 * Create a new user
 */
export const createUser = async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      role,
      email,
      phone,
      houseNo,
      street,
      city
    } = req.body;

    // Validation
    if (!username || !password || !fullName || !role || !phone || !email || !houseNo || !street || !city) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Handle file uploads
    let idCardUrl = null;
    let profilePhotoUrl = null;

    if (req.files && azureBlobService.isReady()) {
      try {
        // Initialize container
        await azureBlobService.initializeContainer();

        // Upload ID card (can be image or PDF)
        if (req.files.idCard && req.files.idCard[0]) {
          const idCardFile = req.files.idCard[0];
          let fileBuffer = idCardFile.buffer;

          // Compress only if it's an image
          if (idCardFile.mimetype.startsWith('image/')) {
            fileBuffer = await compressImage(idCardFile.buffer);
            idCardUrl = await azureBlobService.uploadUserFile(
              fileBuffer,
              username,
              'idcard',
              idCardFile.originalname.replace(/\.[^.]+$/, '.jpg'),
              'image/jpeg'
            );
          } else {
            // Upload PDF as-is
            idCardUrl = await azureBlobService.uploadUserFile(
              fileBuffer,
              username,
              'idcard',
              idCardFile.originalname,
              idCardFile.mimetype
            );
          }
        }

        // Upload profile photo (always an image)
        if (req.files.profilePhoto && req.files.profilePhoto[0]) {
          const profilePhotoFile = req.files.profilePhoto[0];
          const compressedBuffer = await compressImage(profilePhotoFile.buffer);
          profilePhotoUrl = await azureBlobService.uploadUserFile(
            compressedBuffer,
            username,
            'profile',
            profilePhotoFile.originalname.replace(/\.[^.]+$/, '.jpg'),
            'image/jpeg'
          );
        }
      } catch (uploadError) {
        console.error('FILE UPLOAD ERROR:', uploadError);
        // Continue with user creation even if upload fails
      }
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Check if username already exists
      const usernameCheck = await transaction.request()
        .input('username', sql.VarChar(50), username)
        .query(`SELECT U_ID FROM [User] WHERE U_Username = @username`);

      if (usernameCheck.recordset.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }

      // Check if email already exists
      const emailCheck = await transaction.request()
        .input('email', sql.VarChar(100), email)
        .query(`SELECT U_ID FROM [User] WHERE U_Email = @email`);

      if (emailCheck.recordset.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      // Create or find address
      const addressResult = await transaction.request()
        .input('houseNo', sql.VarChar(50), houseNo)
        .input('street', sql.VarChar(100), street)
        .input('city', sql.VarChar(50), city)
        .query(`
          IF EXISTS (SELECT A_ID FROM Address WHERE A_HouseNo = @houseNo AND A_Street = @street AND A_City = @city)
            SELECT A_ID FROM Address WHERE A_HouseNo = @houseNo AND A_Street = @street AND A_City = @city
          ELSE
          BEGIN
            INSERT INTO Address (A_HouseNo, A_Street, A_City)
            OUTPUT INSERTED.A_ID
            VALUES (@houseNo, @street, @city)
          END
        `);

      const addressId = addressResult.recordset[0].A_ID;

      // Create user
      const userResult = await transaction.request()
        .input('username', sql.VarChar(50), username)
        .input('password', sql.VarChar(255), hashedPassword)
        .input('fullName', sql.VarChar(100), fullName)
        .input('role', sql.VarChar(20), role)
        .input('email', sql.VarChar(100), email)
        .input('phone', sql.VarChar(20), phone)
        .input('addressId', sql.Int, addressId)
        .input('idCard', sql.VarChar(500), idCardUrl)
        .input('profilePhoto', sql.VarChar(500), profilePhotoUrl)
        .query(`
          INSERT INTO [User] (U_Username, U_Password, U_FullName, U_Role, U_Email, U_Phone, A_ID, U_IDCard, U_ProfilePhoto)
          OUTPUT INSERTED.U_ID
          VALUES (@username, @password, @fullName, @role, @email, @phone, @addressId, @idCard, @profilePhoto)
        `);

      const userId = userResult.recordset[0].U_ID;

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: userId,
          username,
          fullName,
          role
        }
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('CREATE USER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * PUT /api/users/:id
 * Update user
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      role,
      email,
      phone,
      status,
      houseNo,
      street,
      city
    } = req.body;

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Check if user exists and get current data
      const userCheck = await transaction.request()
        .input('userId', sql.Int, id)
        .query(`SELECT A_ID, U_Username, U_IDCard, U_ProfilePhoto FROM [User] WHERE U_ID = @userId`);

      if (userCheck.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const currentAddressId = userCheck.recordset[0].A_ID;
      const currentUsername = userCheck.recordset[0].U_Username;
      let idCardUrl = userCheck.recordset[0].U_IDCard;
      let profilePhotoUrl = userCheck.recordset[0].U_ProfilePhoto;

      // Handle file uploads if present
      if (req.files && azureBlobService.isReady()) {
        try {
          // Initialize container
          await azureBlobService.initializeContainer();

          // Upload ID card (can be image or PDF)
          if (req.files.idCard && req.files.idCard[0]) {
            const idCardFile = req.files.idCard[0];
            let fileBuffer = idCardFile.buffer;

            // Compress only if it's an image
            if (idCardFile.mimetype.startsWith('image/')) {
              fileBuffer = await compressImage(idCardFile.buffer);
              idCardUrl = await azureBlobService.uploadUserFile(
                fileBuffer,
                currentUsername,
                'idcard',
                idCardFile.originalname.replace(/\.[^.]+$/, '.jpg'),
                'image/jpeg'
              );
            } else {
              // Upload PDF as-is
              idCardUrl = await azureBlobService.uploadUserFile(
                fileBuffer,
                currentUsername,
                'idcard',
                idCardFile.originalname,
                idCardFile.mimetype
              );
            }
          }

          // Upload profile photo (always an image)
          if (req.files.profilePhoto && req.files.profilePhoto[0]) {
            const profilePhotoFile = req.files.profilePhoto[0];
            const compressedBuffer = await compressImage(profilePhotoFile.buffer);
            profilePhotoUrl = await azureBlobService.uploadUserFile(
              compressedBuffer,
              currentUsername,
              'profile',
              profilePhotoFile.originalname.replace(/\.[^.]+$/, '.jpg'),
              'image/jpeg'
            );
          }
        } catch (uploadError) {
          console.error('FILE UPLOAD ERROR:', uploadError);
          // Continue with update even if upload fails
        }
      }

      // Update or create address if provided
      let addressId = currentAddressId;
      if (houseNo && street && city) {
        const addressResult = await transaction.request()
          .input('houseNo', sql.VarChar(50), houseNo)
          .input('street', sql.VarChar(100), street)
          .input('city', sql.VarChar(50), city)
          .query(`
            IF EXISTS (SELECT A_ID FROM Address WHERE A_HouseNo = @houseNo AND A_Street = @street AND A_City = @city)
              SELECT A_ID FROM Address WHERE A_HouseNo = @houseNo AND A_Street = @street AND A_City = @city
            ELSE
            BEGIN
              INSERT INTO Address (A_HouseNo, A_Street, A_City)
              OUTPUT INSERTED.A_ID
              VALUES (@houseNo, @street, @city)
            END
          `);

        addressId = addressResult.recordset[0].A_ID;
      }

      // Update user
      await transaction.request()
        .input('userId', sql.Int, id)
        .input('fullName', sql.VarChar(100), fullName)
        .input('role', sql.VarChar(20), role)
        .input('email', sql.VarChar(100), email)
        .input('phone', sql.VarChar(20), phone)
        .input('status', sql.VarChar(20), status)
        .input('addressId', sql.Int, addressId)
        .input('idCard', sql.VarChar(500), idCardUrl)
        .input('profilePhoto', sql.VarChar(500), profilePhotoUrl)
        .query(`
          UPDATE [User]
          SET U_FullName = @fullName,
              U_Role = @role,
              U_Email = @email,
              U_Phone = @phone,
              U_Status = @status,
              A_ID = @addressId,
              U_IDCard = @idCard,
              U_ProfilePhoto = @profilePhoto
          WHERE U_ID = @userId
        `);

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: 'User updated successfully'
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('UPDATE USER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/users/:id/reset-password
 * Reset user password
 */
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    const pool = await getPool();

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await pool.request()
      .input('userId', sql.Int, id)
      .input('password', sql.VarChar(255), hashedPassword)
      .query(`
        UPDATE [User]
        SET U_Password = @password
        WHERE U_ID = @userId
      `);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * PUT /api/users/:id/deactivate
 * Deactivate user (set status to Resigned)
 */
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    await pool.request()
      .input('userId', sql.Int, id)
      .query(`
        UPDATE [User]
        SET U_Status = 'Resigned'
        WHERE U_ID = @userId
      `);

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('DEACTIVATE USER ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
