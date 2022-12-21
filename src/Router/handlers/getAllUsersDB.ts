/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { THandler } from '../Router.interface';
import { HEADERS } from '../../constants/HEADERS';
import { MESSAGES } from '../../constants/MESSAGES';
import { STATUS_CODE } from '../../constants/STATUS_CODE';

export const getAllUsersDB: THandler = async (db, req, res, keysChecker, getUser) => {

    try {
        res.statusCode = STATUS_CODE.OK;
        res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON_TYPE);

        if (process.send) {
            process.send(db.getAllUsers());
        }

        res.end(JSON.stringify(db.getAllUsers()));
        return;
    } catch {
        res.statusCode = STATUS_CODE.SERVER_500;

        if (process.send) {
            process.send(MESSAGES.SERVER_500);
        }

        res.write(MESSAGES.SERVER_500);
    }
};