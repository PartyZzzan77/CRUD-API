import http from 'http';
import { config } from 'dotenv';
import { TServer, TResponse, TRequest } from './types/serverTypes';


config();


const PORT = +process.env.DB_PORT! || 3000;
const HOST = process.env.DB_HOST as string;

const server: TServer = http.createServer((req: TRequest, res: TResponse): void => {
  res.end('hello');
});


server.listen(PORT, HOST, () => {
  console.log(`server is running on ${HOST}:${PORT}`);
});