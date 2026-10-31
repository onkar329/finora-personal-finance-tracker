import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 8083;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personal_finance_tracker')
  .then(() => app.listen(port, () => console.log(`API running at http://localhost:${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
