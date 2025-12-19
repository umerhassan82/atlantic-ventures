import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'adminpassword123',
    name: process.env.DB_NAME || 'iot_platform',
  }
};
