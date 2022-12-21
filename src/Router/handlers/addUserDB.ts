/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { IUserRequest } from '../../types/userTypes';
import { THandler } from '../Router.interface';

export const addUserDB: THandler = async (db, req, res, keysChecker, getUser) => {
    try {
        const buffers = [];

        for await (const chunk of req) {
            buffers.push(chunk);
        }

        const newUser: IUserRequest = JSON.parse(Buffer.concat(buffers).toString());
        const keysUserRequire = ['username', 'age', 'hobbies'].sort();

        if (keysChecker(newUser, keysUserRequire)) {
            const id = uuidv4();
            newUser.id = id;
            db.addUser(newUser);

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');

            if (process.send) {
                process.send(newUser);
            }

            res.end(JSON.stringify(newUser));
            return;
        } else {
            res.statusCode = 400;

            if (process.send) {
                process.send('Bad Request');
            }

            res.end('Bad Request');
            return;
        }
    } catch {
        res.statusCode = 500;
        if (process.send) {
            process.send('server internal error 500');
        }

        res.write('server internal error 500');
    }
};