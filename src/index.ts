import * as http from 'http';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { TServer, TResponse, TRequest } from './types/serverTypes';
import { checkKeys } from './helpers/checkKeys.js';

config();
interface IUserRequest {
    id: string;
    username: string;
    age: number;
    hobbies: string[] | []
}

let users: IUserRequest[] = [];


const PORT = +process.env.DB_PORT! || 3000;
const HOST = process.env.DB_HOST as string;


const server: TServer = http.createServer(async (req: TRequest, res: TResponse) => {


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
            return res.end(JSON.stringify(newUser));
        } else {
            res.statusCode = 400;
            return res.end('Bad Request');
        }
    } else if (req.url && req.url.includes('/api/users/')) {
        const regExp = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/, 'gm');

        const id = req.url.split('/').slice(3).join();

        if (regExp.test(id)) {
            if (req.method === 'GET') {

                const targetUser = users.filter(user => user.id === id);

                if (targetUser.length) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify(targetUser[0]));
                } else {
                    res.statusCode = 404;
                    return res.end('Not found');
                }

            }
            if (req.method === 'DELETE') {
                const targetUser = users.filter(user => user.id === id);

                if (targetUser.length) {
                    res.setHeader('Content-Type', 'application/json');
                    users = users.filter(user => user.id !== id);
                    res.statusCode = 204;
                    return res.end(JSON.stringify(targetUser[0]));
                } else {
                    res.statusCode = 404;
                    return res.end('Not found');
                }

            }
            if (req.method === 'PUT') {
                console.log('r');
            }
        } else {
            res.statusCode = 400;
            res.end('Bad Request');
        }
    }
});


server.listen(PORT, HOST, () => {
    console.log(`server is running on ${HOST}:${PORT} `);
});