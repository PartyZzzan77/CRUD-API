import * as http from 'http';
import cluster from 'cluster';
import os from 'os';
import { IServer, TRequest, TResponse, TServer } from './server.interfaces';
import { IRouter } from '../Router/Router.interface';
import { checkKeys } from '../helpers/checkKeys.js';
import { IUserRequest } from '../types/userTypes';
import { HOST, PORT, isMulti, pid, } from '../config.js';
import { getTargetUser } from '../helpers/getTargetUser.js';
import { checkId } from './../helpers/checkId.js';
import { IDB } from '../DB/DB.interface';

class Server implements IServer {
    protected _server: TServer;
    protected _db: IDB;

    constructor(router: IRouter, db: IDB) {
        this._db = db;
        this._server = http.createServer(async (req: TRequest, res: TResponse) => {
            try {
                res.setHeader('pid', pid);

                const routerHash = router.getAllRoutes();

                const routeParams = req.url!.split('/') as string[];

                if (routeParams[1] === 'api' && routeParams[2] === 'users' && !routeParams[3]) {
                    const handler = routerHash.filter(route => route.method === req.method && route.url.endsWith('s'))[0].func;

                    handler(this._db, req, res, checkKeys, checkId, getTargetUser);
                    return;
                }

                if (routeParams[1] === 'api' && routeParams[2] === 'users' && routeParams[3]) {
                    const handler = routerHash.filter(route => route.method === req.method && route.url.endsWith('s/'))[0].func;

                    return handler(this._db, req, res, checkKeys, checkId, getTargetUser);

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

    public listen() {
        if (cluster.isPrimary && isMulti) {
            const count = os.cpus().length;
            let port = PORT - 1;

            console.log(`\nActivated ${count} forks 🤖 \n`);
            console.log(`Primary pid: ${pid}`);

            for (let i = 0; i < count; i++) {
                port++;
                const worker = cluster.fork({ port });

                worker.on('exit', () => {
                    console.log(`PID died:${worker.process.pid}`);
                    port++;
                    cluster.fork({ port });
                });

                worker.on('message', (data: IUserRequest[] | string) => {
                    console.log('Worker to Primary', data);
                    worker.send(data);
                });
            }
        }
        else {
            process.on('message', (data: IUserRequest[] | string) => {
                console.log('Primary to worker', data);
            });

            const envPort = Number(process.env['port']) || PORT;

            this._server.listen(envPort, HOST, () => {
                console.log(`✨server is running on ${HOST}:${envPort} PID: ${pid}`);
            });

        }
    }
}

export default Server;