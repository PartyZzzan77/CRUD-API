import * as http from 'http';
import { IServer, TRequest, TResponse, TServer } from './server.interfaces';
import { IRouter } from '../Router/Router.interface';
import { checkKeys } from '../helpers/checkKeys.js';
import { IUserRequest } from '../types/userTypes';
import { HOST, PORT } from '../config.js';
import { getTargetUser } from '../helpers/getTargetUser.js';
import { checkId } from './../helpers/checkId.js';

class Server implements IServer {
    protected _server: TServer;
    protected _users: IUserRequest[];

    constructor(router: IRouter) {
        this._server = http.createServer(async (req: TRequest, res: TResponse) => {
            try {
                const routerHash = router.init();

                const routeParams = req.url!.split('/') as string[];

                if (routeParams[1] === 'api' && routeParams[2] === 'users' && !routeParams[3]) {
                    const cb = routerHash.filter(route => route.method === req.method && route.url.endsWith('s'))[0].func;
                    cb(req, res, checkKeys, checkId, getTargetUser);
                    return;
                }

                if (routeParams[1] === 'api' && routeParams[2] === 'users' && routeParams[3]) {
                    const cb = routerHash.filter(route => route.method === req.method && route.url.endsWith('s/'))[0].func;

                    return cb(req, res, checkKeys, checkId, getTargetUser);

                } else {
                    res.statusCode = 404;
                    res.write('Not found');
                    res.end();
                }
            } catch {
                res.statusCode = 500;
                res.write('server internal error 500');
            }
        });
    }

    public init() {
        this._server.listen(PORT, HOST, () => {
            console.log(`server is running on ${HOST}:${PORT} `);
        });
    }
}


export default Server;