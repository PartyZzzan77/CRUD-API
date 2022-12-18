import * as http from 'http';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { TServer, TResponse, TRequest } from './types/serverTypes';
import { checkKeys } from './helpers/checkKeys.js';
// import fs from 'fs';
// import path, { dirname } from 'path';
//import { fileURLToPath } from 'url';


config();
interface IUserRequest {
    id: string;
    username: string;
    age: number;
    hobbies: string[] | []
}

const users: IUserRequest[] = [];


const PORT = +process.env.DB_PORT! || 3000;
const HOST = process.env.DB_HOST as string;
//const __dirname = dirname(fileURLToPath(import.meta.url));

const server: TServer = http.createServer(async (req: TRequest, res: TResponse): Promise<void> => {

    //const filePath = req.url && path.join(__dirname, 'index.html');

    if (req.url === '/api/users' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(users));
    } else if (req.url === '/api/users' && req.method === 'POST') {

        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }

        const newUser: IUserRequest = JSON.parse(Buffer.concat(buffers).toString());
        const keysUserRequire = ['username', 'age', 'hobbies'].sort();
        const targetKeys = Object.keys(newUser).sort();

        if (checkKeys(targetKeys, keysUserRequire) && targetKeys.length === 3) {
            const id = uuidv4();
            newUser.id = id;
            users.push(newUser);

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newUser));
        } else {
            res.statusCode = 400;
            res.end('Bad Request');
        }
    }
});


server.listen(PORT, HOST, () => {
    console.log(`server is running on ${HOST}:${PORT}`);
});