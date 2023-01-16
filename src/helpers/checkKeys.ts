import { TCheckKeys } from '../types/helpersTypes';
import { IUserRequest } from '../types/userTypes';

export const checkKeys: TCheckKeys = (obj: IUserRequest, arr: string[]): boolean => {
    const target = Object.keys(obj).sort();
    return target.every((e) => arr.sort().includes(e.toLowerCase())) && target.length === arr.length;
};
