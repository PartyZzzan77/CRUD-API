import { IUserRequest } from './../types/userTypes';
import { IDB } from './DB.interface';

class DB implements IDB {
    protected _db: IUserRequest[];

    constructor() {
        this._db = [];
    }

    public getAllUsers() {
        return this._db;
    }

    public addUser(value: IUserRequest) {
        this._db.push(value);
    }

    public updateUsers(value: IUserRequest[]) {
        this._db = value;
    }

}

export const db = new DB;
