import { z } from 'zod';

const sensorTypeSchema = z.enum(['temperature', 'fuel_level', 'speed', 'gps']);

export const sensorDataPointSchema = z.object({
  device_id: z.string().min(3).max(50),
  sensor_type: sensorTypeSchema,
  value: z.number(),
  unit: z.string().max(20).optional(),
  timestamp: z.coerce.date(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const bulkIngestSchema = z.object({
  data: z.array(sensorDataPointSchema).min(1).max(1000)
});