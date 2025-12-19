-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Devices table
CREATE TABLE devices (
    device_id VARCHAR(50) PRIMARY KEY,
    device_type VARCHAR(20) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Device readings table (sensor data)
CREATE TABLE device_readings (
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    device_id VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    speed DECIMAL(5, 2),
    fuel_level DECIMAL(5, 2),
    temperature DECIMAL(5, 2),
    PRIMARY KEY (time, device_id)
);

-- Convert to hypertable (time-series optimized)
SELECT create_hypertable('device_readings', 'time');

-- Index for faster queries
CREATE INDEX idx_readings_device ON device_readings(device_id, time DESC);