import { IUserRequest } from '../types/userTypes';
import { TRequest } from '../Server/server.interfaces';

export const getTargetUser = (data: IUserRequest[], req: TRequest) => {
    if (req.url) {
        const id = req.url.split('/').slice(3).join();
        const targetUser = data.filter((user) => user.id === id);

        return targetUser[0];
    }

    return undefined;
};
