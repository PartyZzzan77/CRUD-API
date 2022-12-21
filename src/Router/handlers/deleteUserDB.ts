import { THandler } from '../Router.interface';

export const deleteUserDB: THandler = async (db, req, res, keysChecker, idChecker, getUser) => {
    try {
        const targetUser = getUser(db.getAllUsers(), req);

        if (idChecker(req) && targetUser) {
            const filteredDb = db.getAllUsers().filter(user => user.id !== targetUser.id);
            db.updateUsers(filteredDb);

            res.statusCode = 204;
            res.setHeader('Content-Type', 'application/json');

            if (process.send) {
                process.send(targetUser);
            }

            res.end(JSON.stringify(targetUser));
            return;
        } else if (idChecker(req) && !targetUser) {
            res.statusCode = 404;

            if (process.send) {
                process.send!('Not Found');
            }

            res.end('Not Found');
            return;
        } else {
            res.statusCode = 400;
            if (process.send) {
                process.send!('Bad Request');
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