import { Router } from 'express';
import { ingestService } from '../services/ingest';
import { bulkIngestSchema } from '../utils/validation';
import { authenticate } from '../middleware/auth';
import { ZodError } from 'zod';

export const ingestRouter = Router();

ingestRouter.post('/', authenticate, async (req, res) => {
  try {
    const validated = bulkIngestSchema.parse(req.body);
    const result = await ingestService.ingestData(validated.data);
    
    res.status(result.success ? 200 : 207).json(result);
    
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid data',
        details: error.issues
      });
    }
    
    console.error('Ingest failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

ingestRouter.get('/test', (req, res) => {
  res.json({ status: 'ok' });
});