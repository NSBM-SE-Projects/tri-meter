import { getPool } from '../config/database.js';

/**
 * Create new inquiry
 * POST /api/inquiries
 */
export const createInquiry = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    // Validation
    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email, subject, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Get database pool
    const pool = await getPool();

    // Insert inquiry
    const result = await pool.request()
      .input('email', email)
      .input('subject', subject)
      .input('message', message)
      .query(`
        INSERT INTO Inquiry (I_Email, I_Subject, I_Message)
        OUTPUT INSERTED.I_ID, INSERTED.I_Date
        VALUES (@email, @subject, @message)
      `);

    const inquiry = result.recordset[0];

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        inquiryId: inquiry.I_ID,
        submittedAt: inquiry.I_Date
      }
    });

  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again later.'
    });
  }
};
