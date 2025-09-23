import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const isDevEnv = process.env.STAGE === 'dev';
try {
  if (isDevEnv) {
    dotenv.config({ path: '.env.dev' });
  } else {
    dotenv.config({ path: '.env.prod' });
  }
} catch (error) {
  console.error('Error loading environment variables:', error);
}

export default new DataSource({
  ssl: false,
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/2-Domain/index.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
