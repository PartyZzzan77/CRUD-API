import { config } from 'dotenv';

config();

export const PORT = +process.env.DB_PORT! || 3000;
export const HOST = process.env.DB_HOST as string;
export const pid = process.pid;
export const isMulti = (process.argv.splice(2).pop() === '--cluster=run');