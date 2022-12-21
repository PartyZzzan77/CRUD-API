/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { IDB } from '../DB/DB.interface';
import { IUserRequest } from './../types/userTypes';
import { IRoute, IRouter } from './Router.interface';

class Router implements IRouter {
    protected _routing: IRoute[];

    constructor() {
        this._routing = [
            {
                url: '/api/users',
                method: 'GET',
                func: async (db, req, res, keysChecker, getUser) => {

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
                }
            },
            {
                url: '/api/users',
                method: 'POST',
                func: async (db, req, res, keysChecker, getUser) => {
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
                }
            },
            {
                url: '/api/users/',
                method: 'GET',
                func: async (db, req, res, keysChecker, idChecker, getUser) => {
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
                }
            },
            {
                url: '/api/users/',
                method: 'PUT',
                func: async (db, req, res, keysChecker, idChecker, getUser) => {
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
                }
            },
            {
                url: '/api/users/',
                method: 'DELETE',
                func: async (db, req, res, keysChecker, idChecker, getUser) => {
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
                }
            }
        ];
    }

    public getAllRoutes() {
        return this._routing;
    }
}

export default Router;