/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { IUserRequest } from '../../types/userTypes';
import { keysUserRequire } from '../Router.js';
import { THandler } from '../Router.interface';
import { HEADERS } from '../../constants/HEADERS';
import { MESSAGES } from '../../constants/MESSAGES';

export const addUserDB: THandler = async (db, req, res, keysChecker, getUser) => {
    try {
        const buffers = [];

        for await (const chunk of req) {
            buffers.push(chunk);
        }

        const newUser: IUserRequest = JSON.parse(Buffer.concat(buffers).toString());

        if (keysChecker(newUser, keysUserRequire)) {
            const id = uuidv4();
            newUser.id = id;
            db.addUser(newUser);

            res.statusCode = 201;
            res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON_TYPE);

            if (process.send) {
                process.send(newUser);
            }

            res.end(JSON.stringify(newUser));
            return;
        } else {
            res.statusCode = 400;

            if (process.send) {
                process.send(MESSAGES.BAD_REQUEST);
            }

            res.end(MESSAGES.BAD_REQUEST);
            return;
        }
    } catch {
        res.statusCode = 500;
        if (process.send) {
            process.send(MESSAGES.SERVER_500);
        }

        res.write(MESSAGES.SERVER_500);
    }
};