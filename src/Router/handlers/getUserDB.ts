import { THandler } from '../Router.interface';

export const getUserDB: THandler = async (db, req, res, keysChecker, idChecker, getUser) => {
    try {
        if (req.url) {
            const targetUser = getUser(db.getAllUsers(), req);

            if (idChecker(req) && targetUser) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');

                if (process.send) {
                    process.send(targetUser);
                }

                res.end(JSON.stringify(targetUser));
                return;
            } else if (idChecker(req) && !targetUser) {
                res.statusCode = 404;

                if (process.send) {
                    process.send('Not Found');
                }

                return res.end('Not Found');
            } else {
                res.statusCode = 400;

                if (process.send) {
                    process.send('Bad Request');
                }

                return res.end('Bad Request');
            }
        }
    } catch {
        res.statusCode = 500;
        if (process.send) {
            process.send('server internal error 500');
        }

        res.write('server internal error 500');
    }
};