import { IRoute, IRouter } from './Router.interface';
import { addUserDB, deleteUserDB, getAllUsersDB, getUserDB, putUserDB } from './handlers/index.js';
import { URL_CONSTANTS } from '../constants/URL_CONSTANTS';

export const keysUserRequire = ['username', 'age', 'hobbies'].sort();

class Router implements IRouter {
    protected _routing: IRoute[];

    constructor() {
        this._routing = [
            {
                url: URL_CONSTANTS.BASE,
                method: 'GET',
                func: getAllUsersDB
            },
            {
                url: URL_CONSTANTS.BASE,
                method: 'POST',
                func: addUserDB
            },
            {
                url: URL_CONSTANTS.BASE_ID,
                method: 'GET',
                func: getUserDB
            },
            {
                url: URL_CONSTANTS.BASE_ID,
                method: 'PUT',
                func: putUserDB
            },
            {
                url: URL_CONSTANTS.BASE_ID,
                method: 'DELETE',
                func: deleteUserDB
            }
        ];
    }

    public getAllRoutes() {
        return this._routing;
    }
}

export default Router;