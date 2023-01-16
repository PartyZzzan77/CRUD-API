import { TRequest } from '../Server/server.interfaces';

export const checkId = (req: TRequest) => {
    if (req.url) {
        const regExp = new RegExp(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
            'gm',
        );

        const id = req.url.split('/').slice(3).join();

        return regExp.test(id);
    }
};
