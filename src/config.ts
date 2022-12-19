import { config } from 'dotenv';

config();

export const PORT = +process.env.DB_PORT! || 3000;
export const HOST = process.env.DB_HOST as string;