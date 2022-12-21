/* eslint-disable no-unused-vars */
import { TCheckId, TGetTargetUser, TCheckKeys } from './../types/helpersTypes';
import { TRequest, TResponse } from '../Server/server.interfaces';
import { IDB } from '../DB/DB.interface';
export interface IRouter {
    getAllRoutes: () => IRoute[]
}

export type TCRUD = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type THandler = (db: IDB, req: TRequest, res: TResponse, keysChecker: TCheckKeys, idChecker: TCheckId, getUser: TGetTargetUser) => Promise<TResponse | void>
export interface IRoute {
    url: string;
    method: TCRUD;
    func: THandler
}