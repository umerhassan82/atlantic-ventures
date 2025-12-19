export type SensorType = 
  | 'temperature'
  | 'fuel_level'
  | 'speed'
  | 'gps';

export interface SensorDataPoint {
  device_id: string;
  sensor_type: SensorType;
  value: number;
  unit?: string;
  timestamp: Date;
  latitude?: number;
  longitude?: number;
}

export interface IngestResponse {
  success: boolean;
  inserted_count: number;
  failed_count: number;
  processing_time_ms: number;
  errors?: Array<{ index: number; error: string }>;
}