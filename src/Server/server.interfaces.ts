/* eslint-disable no-unused-vars */
import http from 'http';
import { TCheckKeys, TCheckId, TGetTargetUser } from './../types/helpersTypes';
import { IRouter } from './../Router/Router.interface';
import { IDB } from '../DB/DB.interface';

export interface IServer {
    testServer: () => TServer;
    listen: () => void;
}

export type ProcessRoute = (
    db: IDB,
    router: IRouter,
    req: TRequest,
    res: TResponse,
    pid: number,
    checkKeys: TCheckKeys,
    checkId: TCheckId,
    getTargetUser: TGetTargetUser,
) => void;

export type TServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export type TRequest = http.IncomingMessage;

export type TResponse = http.ServerResponse;
