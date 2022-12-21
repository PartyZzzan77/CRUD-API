import { IRoute, IRouter } from './Router.interface';
import { addUserDB, deleteUserDB, getAllUsersDB, getUserDB, putUserDB } from './handlers/index.js';

class Router implements IRouter {
    protected _routing: IRoute[];

    constructor() {
        this._routing = [
            {
                url: '/api/users',
                method: 'GET',
                func: getAllUsersDB
            },
            {
                url: '/api/users',
                method: 'POST',
                func: addUserDB
            },
            {
                url: '/api/users/',
                method: 'GET',
                func: getUserDB
            },
            {
                url: '/api/users/',
                method: 'PUT',
                func: putUserDB
            },
            {
                url: '/api/users/',
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