import * as http from 'http';
import cluster from 'cluster';
import { IServer, TRequest, TResponse, TServer } from './server.interfaces';
import { IDB } from '../DB/DB.interface';
import { IRouter } from '../Router/Router.interface';
import { checkKeys } from '../helpers/checkKeys.js';
import { HOST, PORT, isMulti, pid, } from '../config.js';
import { getTargetUser } from '../helpers/getTargetUser.js';
import { checkId } from './../helpers/checkId.js';
import { processRoute } from './processRoute.js';
import { runServerListener } from './runServerListener.js';
import { runClusters } from './runClusters.js';

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
            runClusters(PORT, pid);
        }
        else {
            runServerListener(this._server, HOST, PORT, pid);
        }
    }
}

export default Server;