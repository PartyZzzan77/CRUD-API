/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { IUserRequest } from '../../types/userTypes';
import { keysUserRequire } from '../Router.js';
import { THandler } from '../Router.interface';
import { HEADERS } from '../../constants/HEADERS';
import { MESSAGES } from '../../constants/MESSAGES';
import { STATUS_CODE } from '../../constants/STATUS_CODE';

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

            res.statusCode = STATUS_CODE.CREATED;
            res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON_TYPE);

            if (process.send) {
                process.send(newUser);
            }

            res.end(JSON.stringify(newUser));
            return;
        } else {
            res.statusCode = STATUS_CODE.BAD_REQUEST;

            if (process.send) {
                process.send(MESSAGES.BAD_REQUEST);
            }

            res.end(MESSAGES.BAD_REQUEST);
            return;
        }
    } catch {
        res.statusCode = STATUS_CODE.SERVER_500;
        if (process.send) {
            process.send(MESSAGES.SERVER_500);
        }

        res.write(MESSAGES.SERVER_500);
    }
};