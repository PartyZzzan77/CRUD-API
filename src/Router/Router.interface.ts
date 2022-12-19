import { TCheckId, TGetTargetUser } from './../types/helpersTypes';
import { TRequest, TResponse } from '../Server/server.interfaces';
import { TCheckKeys } from '../types/helpersTypes';
export interface IRouter {
    init: () => IRoute[]
}
export interface IRoute {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    // eslint-disable-next-line no-unused-vars
    func: (req: TRequest, res: TResponse, keysChecker: TCheckKeys, idChecker: TCheckId, getUser: TGetTargetUser) => Promise<TResponse | void>
}