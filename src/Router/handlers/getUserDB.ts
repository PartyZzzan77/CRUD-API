import { HEADERS } from '../../constants/HEADERS';
import { MESSAGES } from '../../constants/MESSAGES';
import { STATUS_CODE } from '../../constants/STATUS_CODE';
import { THandler } from '../Router.interface';

export const getUserDB: THandler = async (db, req, res, keysChecker, idChecker, getUser) => {
    try {
        if (req.url) {
            const targetUser = getUser(db.getAllUsers(), req);

            if (idChecker(req) && targetUser) {
                res.statusCode = STATUS_CODE.OK;
                res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JSON_TYPE);

                if (process.send) {
                    process.send(targetUser);
                }

                res.end(JSON.stringify(targetUser));
                return;
            } else if (idChecker(req) && !targetUser) {
                res.statusCode = STATUS_CODE.NOT_FOUND;

                if (process.send) {
                    process.send(MESSAGES.NOT_FOUND);
                }

                return res.end(MESSAGES.NOT_FOUND);
            } else {
                res.statusCode = STATUS_CODE.BAD_REQUEST;

                if (process.send) {
                    process.send(MESSAGES.BAD_REQUEST);
                }

                return res.end(MESSAGES.BAD_REQUEST);
            }
        }
    } catch {
        res.statusCode = STATUS_CODE.SERVER_500;
        if (process.send) {
            process.send(MESSAGES.SERVER_500);
        }

        res.write(MESSAGES.SERVER_500);
    }
};