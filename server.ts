import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { initDB, getDBStatus } from './src/server/db.js';

import authRoutes from './src/server/routes/authRoutes.js';
import studentRoutes from './src/server/routes/studentRoutes.js';
import institutionRoutes from './src/server/routes/institutionRoutes.js';
import scholarshipRoutes from './src/server/routes/scholarshipRoutes.js';
import applicationRoutes from './src/server/routes/applicationRoutes.js';
import verificationRoutes from './src/server/routes/verificationRoutes.js';
import paymentRoutes from './src/server/routes/paymentRoutes.js';
import adminRoutes from './src/server/routes/adminRoutes.js';
import notificationRoutes from './src/server/routes/notificationRoutes.js';
import documentRoutes from './src/server/routes/documentRoutes.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize DB & Seed Data
  await initDB();

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ScholarSetu Centralized Verification API',
      version: '1.0.0-SIH-MVP',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/health/db', (req, res) => {
    const status = getDBStatus();
    res.json({
      success: true,
      database: 'MongoDB (Mongoose ORM)',
      ...status,
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/institutions', institutionRoutes);
  app.use('/api/scholarships', scholarshipRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/verifications', verificationRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/documents', documentRoutes);

  // Vite Middleware for development / Production Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ScholarSetu Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
