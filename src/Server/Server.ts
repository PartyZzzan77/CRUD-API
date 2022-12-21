import * as http from 'http';
import cluster from 'cluster';
import os from 'os';
import { IServer, TRequest, TResponse, TServer } from './server.interfaces';
import { IDB } from '../DB/DB.interface';
import { IRouter } from '../Router/Router.interface';
import { checkKeys } from '../helpers/checkKeys.js';
import { IUserRequest } from '../types/userTypes';
import { HOST, PORT, isMulti, pid, } from '../config.js';
import { getTargetUser } from '../helpers/getTargetUser.js';
import { checkId } from './../helpers/checkId.js';
import { processRoute } from './processRoute.js';

class Server implements IServer {
    protected _server: TServer;
    protected _db: IDB;

    constructor(router: IRouter, db: IDB) {
        this._db = db;
        this._server = http.createServer(async (req: TRequest, res: TResponse) => {
            processRoute(this._db, router, req, res, pid, checkKeys, checkId, getTargetUser);
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