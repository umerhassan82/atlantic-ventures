import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import { testConnection } from './config/database';
import { ingestRouter } from './routes/ingest';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// test route
app.get('/test', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/v1/ingest', ingestRouter);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Handle errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Start
async function start() {
  await testConnection();
  
  app.listen(config.port, () => {
    console.log(`Running on port ${config.port}`);
  });
}

start();