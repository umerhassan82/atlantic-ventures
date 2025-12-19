import { pool } from '../config/database';
import { SensorDataPoint, IngestResponse } from '../types';

class IngestService {
  async ingestData(dataPoints: SensorDataPoint[]): Promise<IngestResponse> {
    const startTime = Date.now();
    let inserted = 0;
    let failed = 0;
    const errors: any[] = [];

    for (let i = 0; i < dataPoints.length; i++) {
      const point = dataPoints[i];
      
      try {
        const normalized = this.normalize(point);

        console.log(normalized);
        
        await pool.query(
          `INSERT INTO device_readings 
           (device_id, latitude, longitude, speed, fuel_level, temperature, time) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            normalized.device_id,
            normalized.latitude,
            normalized.longitude,
            normalized.sensor_type === 'speed' ? normalized.value : null,
            normalized.sensor_type === 'fuel_level' ? normalized.value : null,
            normalized.sensor_type === 'temperature' ? normalized.value : null,
            normalized.timestamp
          ]
        );
        
        inserted++;
        
      } catch (error) {
        failed++;
        errors.push({ index: i, error: String(error) });
      }
    }
    
    return {
      success: failed === 0,
      inserted_count: inserted,
      failed_count: failed,
      processing_time_ms: Date.now() - startTime,
      errors: errors.length > 0 ? errors : undefined
    };
  }
  
  private normalize(point: SensorDataPoint): SensorDataPoint {
    let normalized = { ...point };
    
    // Convert Fahrenheit to Celsius
    if (point.sensor_type === 'temperature' && point.unit === 'F') {
      normalized.value = (point.value - 32) * 5/9;
      normalized.unit = 'C';
    }
    
    // Convert mph to km/h
    if (point.sensor_type === 'speed' && point.unit === 'mph') {
      normalized.value = point.value * 1.60934;
      normalized.unit = 'km/h';
    }
    
    return normalized;
  }
}

export const ingestService = new IngestService();