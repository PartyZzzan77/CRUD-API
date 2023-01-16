import { IServer } from '../Server/server.interfaces';
import { IApp } from './App.interface';

export class App implements IApp {
    protected _server: IServer;

    constructor(server: IServer) {
        this._server = server;
    }

    public async run() {
        return this._server.listen();
    }
}
