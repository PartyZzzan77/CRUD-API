/* eslint-disable no-unused-vars */
import { TRequest } from '../Server/server.interfaces';
import { IUserRequest } from './userTypes';

export type TCheckKeys = (obj: IUserRequest, arr: string[]) => boolean;

export type TCheckId = (req: TRequest) => boolean | undefined

export type TGetTargetUser = (data: IUserRequest[], req: TRequest) => IUserRequest | undefined