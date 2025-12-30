import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from '../config/database.js';

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and Password are required'
      });
    }

    // Get database pool
    const pool = await getPool();

    // Find user by username
    const result = await pool.request()
      .input('username', username)
      .query('SELECT U_ID, U_Username, U_Password, U_FullName, U_Role, U_Status FROM [User] WHERE U_Username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Username or Password'
      });
    }

    const user = result.recordset[0];

    // Check if user status is active
    if (user.U_Status !== 'Working') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.U_Password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Username or Password'
      });
    }

    // Remove password from response
    delete user.U_Password;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.U_ID,
        username: user.U_Username,
        role: user.U_Role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success with token
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      data: {
        userId: user.U_ID,
        username: user.U_Username,
        fullName: user.U_FullName,
        role: user.U_Role,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};
