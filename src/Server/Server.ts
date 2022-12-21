import * as http from 'http';
import cluster from 'cluster';
import { IServer, TRequest, TResponse, TServer } from './server.interfaces';
import { IDB } from '../DB/DB.interface';
import { IRouter } from '../Router/Router.interface';
import { HOST, PORT, isMulti, pid, } from '../config.js';
import { processRoute } from './processRoute.js';
import { runServerListener } from './runServerListener.js';
import { runClusters } from './runClusters.js';
import { checkKeys } from '../helpers/checkKeys.js';
import { checkId } from '../helpers/checkId.js';
import { getTargetUser } from '../helpers/getTargetUser.js';


class Server implements IServer {
    protected _server: TServer;
    protected _db: IDB;

    constructor(router: IRouter, db: IDB) {
        this._db = db;
        this._server = http.createServer(async (req: TRequest, res: TResponse) => {
            processRoute(this._db, router, req, res, pid, checkKeys, checkId, getTargetUser);
        });

        this.listen = this.listen.bind(this);
    }

    testServer() {
        return this._server;
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