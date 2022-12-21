import { TCheckId, TGetTargetUser, TCheckKeys } from './../types/helpersTypes';
import { TRequest, TResponse } from '../Server/server.interfaces';
import { IDB } from '../DB/DB.interface';
export interface IRouter {
    getAllRoutes: () => IRoute[]
}
export interface IRoute {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    // eslint-disable-next-line no-unused-vars
    func: (db: IDB, req: TRequest, res: TResponse, keysChecker: TCheckKeys, idChecker: TCheckId, getUser: TGetTargetUser) => Promise<TResponse | void>
}