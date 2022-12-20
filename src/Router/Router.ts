/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import { IUserRequest } from './../types/userTypes';
import { IRoute, IRouter } from './Router.interface';

class Router implements IRouter {
    protected _routing: IRoute[];
    protected _db: IUserRequest[];

    constructor() {
        this._db = [];
        this._routing = [
            {
                url: '/api/users',
                method: 'GET',
                func: async (req, res, keysChecker, getUser) => {
                    try {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');

                        process.send!(this._db);
                        res.end(JSON.stringify(this._db));
                        return;
                    } catch {
                        res.statusCode = 500;
                        res.write('server internal error 500');
                    }
                }
            },
            {
                url: '/api/users',
                method: 'POST',
                func: async (req, res, keysChecker, getUser) => {
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
                            this._db.push(newUser);

                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');

                            process.send!(newUser);
                            res.end(JSON.stringify(newUser));
                            return;
                        } else {
                            res.statusCode = 400;

                            process.send!('Bad Request');
                            return res.end('Bad Request');
                        }
                    } catch {
                        res.statusCode = 500;

                        process.send!('server internal error 500');
                        res.write('server internal error 500');
                    }
                }
            },
            {
                url: '/api/users/',
                method: 'GET',
                func: async (req, res, keysChecker, idChecker, getUser) => {
                    try {
                        if (req.url) {
                            const targetUser = getUser(this._db, req);

                            if (idChecker(req) && targetUser) {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');

                                process.send!(targetUser);
                                res.end(JSON.stringify(targetUser));
                                return;
                            } else if (idChecker(req) && !targetUser) {
                                res.statusCode = 404;

                                process.send!('Not Found');
                                return res.end('Not Found');
                            } else {
                                res.statusCode = 400;

                                process.send!('Bad Request');
                                return res.end('Bad Request');
                            }
                        }
                    } catch {
                        res.statusCode = 500;

                        process.send!('server internal error 500');
                        res.write('server internal error 500');
                    }
                }
            },
            {
                url: '/api/users/',
                method: 'PUT',
                func: async (req, res, keysChecker, idChecker, getUser) => {
                    try {
                        const targetUser = getUser(this._db, req);

                        if (targetUser) {
                            const buffers = [];
                            for await (const chunk of req) {
                                buffers.push(chunk);
                            }

                            const updateUser: IUserRequest = JSON.parse(Buffer.concat(buffers).toString());

                            updateUser.id = targetUser.id;
                            this._db = this._db.filter(user => user.id !== targetUser.id);
                            this._db.push(updateUser);

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');

                            process.send!(updateUser);
                            res.end(JSON.stringify(updateUser));
                            return;
                        } else if (!targetUser) {
                            res.statusCode = 404;

                            process.send!('Not Found');
                            return res.end('Not Found');
                        } else {
                            res.statusCode = 400;

                            process.send!('Bad Request');
                            return res.end('Bad Request');
                        }
                    } catch {
                        res.statusCode = 500;

                        process.send!('server internal error 500');
                        res.write('server internal error 500');
                    }
                }
            },
            {
                url: '/api/users/',
                method: 'DELETE',
                func: async (req, res, keysChecker, idChecker, getUser) => {
                    try {
                        const targetUser = getUser(this._db, req);

                        if (idChecker(req) && targetUser) {
                            this._db = this._db.filter(user => user.id !== targetUser.id);

                            res.statusCode = 204;
                            res.setHeader('Content-Type', 'application/json');

                            process.send!(targetUser);
                            res.end(JSON.stringify(targetUser));
                            return;
                        } else if (idChecker(req) && !targetUser) {
                            res.statusCode = 404;

                            process.send!('Not Found');
                            return res.end('Not Found');
                        } else {
                            res.statusCode = 400;

                            process.send!('Bad Request');
                            return res.end('Bad Request');
                        }
                    } catch {
                        res.statusCode = 500;

                        process.send!('server internal error 500');
                        res.write('server internal error 500');
                    }
                }
            }
        ];
    }

    public init() {
        return this._routing;
    }
}

export default Router;