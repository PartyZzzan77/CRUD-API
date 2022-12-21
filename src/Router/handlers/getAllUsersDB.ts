/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { THandler } from '../Router.interface';

export const getAllUsersDB: THandler = async (db, req, res, keysChecker, getUser) => {

    try {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        if (process.send) {
            process.send(db.getAllUsers());
        }

        res.end(JSON.stringify(db.getAllUsers()));
        return;
    } catch {
        res.statusCode = 500;

        if (process.send) {
            process.send('server internal error 500');
        }

        res.write('server internal error 500');
    }
};