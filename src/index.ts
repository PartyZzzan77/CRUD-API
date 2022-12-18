import http from 'http';
import { config } from 'dotenv';
config();


const PORT = +process.env.DB_PORT! || 3000;
const HOST = process.env.DB_HOST as string;

const server = http.createServer((req, res) => {
  res.end('hello');
});


server.listen(PORT, HOST, () => {
  console.log(`server is running on ${HOST}:${PORT}`);
});