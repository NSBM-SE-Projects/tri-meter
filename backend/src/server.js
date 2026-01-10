import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPool, closePool } from './config/database.js';

// Import middleware
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

// Import routes
import systemRoutes from './routes/system.js';
import authRoutes from './routes/auth.js';
import inquiryRoutes from './routes/inquiry.js';
import dashboardRoutes from './routes/dashboard.js';
import customerRoutes from './routes/customer.js';
import serviceConnectionRoutes from './routes/serviceConnection.js';
import meterReadingRoutes from './routes/meterReading.js';
import billRoutes from './routes/bill.js';
import paymentRoutes from './routes/payment.js';
import tariffRoutes from './routes/tariff.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// ===== MIDDLEWARE =====

app.use(cors({
  origin: '*', // TODO: Change to Vercel URL in production
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ===== ROUTES =====

app.use('/api', systemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/service-connections', serviceConnectionRoutes);
app.use('/api/meter-readings', meterReadingRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tariffs', tariffRoutes);

// ===== ERROR HANDLERS =====

app.use(notFoundHandler);
app.use(globalErrorHandler);

// ===== SERVER STARTUP =====

app.listen(PORT, async () => {
  console.log('\n=================================');
  console.log(`TRI-METER API | STARTED`);
  console.log(`===================================`);
  console.log(`Url: http://localhost:${PORT}`);
  console.log(`Database: ${process.env.DB_DATABASE}`);
  console.log(`Server: ${process.env.DB_SERVER}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('=================================\n');

  // Test database connection on startup
  try {
    await getPool();
  } catch (error) {
    console.error('DATABASE CONNECTION STARTUP | WARNING');
    console.error('SERVER STARTED | DATABASE OPERATIONS UNAVAILABLE');
  }
});

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('\nSIGTERM | SHUTTING DOWN | GRACEFULLY...');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT | SHUTTING DOWN | GRACEFULLY...');
  await closePool();
  process.exit(0);
});

export default app;
