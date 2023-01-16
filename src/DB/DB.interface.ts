/* eslint-disable no-unused-vars */
import { IUserRequest } from '../types/userTypes';

export interface IDB {
    getAllUsers: () => IUserRequest[];
    addUser: (value: IUserRequest) => void;
    updateUsers: (value: IUserRequest[]) => void;
}
