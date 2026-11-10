import express from 'express';
import { apiRouter } from './routes.ts';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount API routes
app.use('/api', apiRouter);
