# IoT Fleet Management - Data Ingest Service

Data ingestion API for fleet tracking system. Handles sensor data from trucks, trailers, and containers with validation, normalization, and time-series storage.

## Features

- Bulk sensor data ingestion
- Unit normalization (Fahrenheit to Celsius, mph to km/h)
- Time-series optimized storage with TimescaleDB
- Request validation with detailed error messages

## Tech Stack

- Node.js + TypeScript + Express
- PostgreSQL with TimescaleDB
- Zod for validation
- Docker + Kubernetes

## Quick Start

### Local Development

1. Start database:
```bash
docker-compose up -d
```

2. Run migrations:
```bash
npm run migrate
```

3. Start server:
```bash
npm install
npm run dev
```

4. Test:
```bash
node test.js
```

Server runs on http://localhost:3000

## API Endpoints

### POST /api/v1/ingest

Ingest sensor data from devices.

**Request:**
```json
{
  "data": [
    {
      "device_id": "TRUCK-001",
      "sensor_type": "temperature",
      "value": 75.5,
      "unit": "F",
      "timestamp": "2024-12-19T10:30:00Z",
      "latitude": 47.6062,
      "longitude": -122.3321
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "inserted_count": 1,
  "failed_count": 0,
  "processing_time_ms": 45
}
```

**Supported Sensors:**
- `temperature` - Temperature readings (C or F)
- `speed` - Vehicle speed (km/h or mph)
- `fuel_level` - Fuel percentage
- `gps` - Location tracking

### GET /test

Health check.

**Response:**
```json
{
  "status": "ok"
}
```

## Data Normalization

The service automatically normalizes units:
- Temperature: Fahrenheit → Celsius
- Speed: mph → km/h

## Database Schema

**devices table:**
- device_id (primary key)
- device_type
- metadata (JSON)
- created_at

**device_readings table (hypertable):**
- time (timestamp)
- device_id
- latitude, longitude
- speed, fuel_level, temperature

## Kubernetes Deployment

### Build Image
```bash
docker build -t iot-ingest:latest .
```

### Deploy
```bash
kubectl apply -f k8s/
```

This creates:
- 2 API replicas for high availability
- PostgreSQL with persistent storage
- LoadBalancer service on port 80

### Check Status
```bash
kubectl get pods
kubectl get services
```

### Scale
```bash
kubectl scale deployment iot-ingest-api --replicas=5
```

## Project Structure
```
├── src/
│   ├── app.ts              # Express server
│   ├── config/
│   │   ├── env.ts          # Environment config
│   │   └── database.ts     # DB connection
│   ├── routes/
│   │   └── ingest.ts       # API routes
│   ├── services/
│   │   └── ingest.ts       # Business logic
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── utils/
│       └── validation.ts   # Zod schemas
├── k8s/                    # Kubernetes configs
├── docker-compose.yaml     # Local DB setup
└── Dockerfile             # Container image
```

## Environment Variables
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=
DB_NAME=iot_platform
```

## Testing

Send test data:
```bash
node test.js
```


## Notes

- Max 1000 data points per request
- Timestamps cannot be in the future
- GPS coordinates validated (lat: -90 to 90, lng: -180 to 180)
- Database uses TimescaleDB for time-series optimization


## Presentaion link

https://docs.google.com/presentation/d/1dbV6DXDTU0BpESPQxIt4wEFaGL11UlioQa3jP9pXR0Q/edit?usp=sharing