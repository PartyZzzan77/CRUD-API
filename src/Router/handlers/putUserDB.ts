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

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');

            if (process.send) {
                process.send(updateUser);
            }

            res.end(JSON.stringify(updateUser));
            return;
        } else if (!targetUser) {
            res.statusCode = 404;

            if (process.send) {
                process.send('Not Found');
            }

            res.end('Not Found');
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