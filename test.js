const testData = {
  data: [
    {
      device_id: "TRUCK-001",
      sensor_type: "temperature",
      value: 25.5,
      unit: "F",
      timestamp: new Date().toISOString()
    },
    {
      device_id: "TRUCK-001",
      sensor_type: "speed",
      value: 85,
      unit: "km/h",
      timestamp: new Date().toISOString(),
      latitude: 52.52,
      longitude: 13.405
    },
    {
      device_id: "TRUCK-002",
      sensor_type: "fuel_level",
      value: 45.8,
      unit: "%",
      timestamp: new Date().toISOString()
    }
  ]
};

async function testIngest() {
  try {
    console.log('Sending data...');
    
    const response = await fetch('http://localhost:3000/api/v1/ingest', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': 'iot-atlantic-ventures-12345'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Failed:', error);
  }
}

testIngest();