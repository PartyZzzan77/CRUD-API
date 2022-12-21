import { checkId } from './../../helpers/checkId';
import { HEADERS } from '../../constants/HEADERS';
import { MESSAGES } from '../../constants/MESSAGES';
import { STATUS_CODE } from '../../constants/STATUS_CODE';
import { IUserRequest } from '../../types/userTypes';
import { THandler } from './../Router.interface';

export const putUserDB: THandler = async (db, req, res, keysChecker, idChecker, getUser) => {
    try {
        const targetUser = getUser(db.getAllUsers(), req);

        if (targetUser) {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }

            const updateUser: IUserRequest = JSON.parse(Buffer.concat(buffers).toString());

            updateUser.id = targetUser.id;

            const filteredDb = db.getAllUsers().filter(user => user.id !== targetUser.id);

            filteredDb.push(updateUser);

            db.updateUsers(filteredDb);

            res.statusCode = STATUS_CODE.OK;
            res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON_TYPE);

            if (process.send) {
                process.send(updateUser);
            }

            res.end(JSON.stringify(updateUser));
            return;
        } else if (idChecker(req) && !targetUser) {
            res.statusCode = STATUS_CODE.NOT_FOUND;

            if (process.send) {
                process.send(MESSAGES.NOT_FOUND);
            }

            res.end(MESSAGES.NOT_FOUND);
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