import { MESSAGES } from '../constants/MESSAGES';
import { STATUS_CODE } from '../constants/STATUS_CODE';
import { URL_CONSTANTS } from '../constants/URL_CONSTANTS';
import { ProcessRoute } from './server.interfaces';

export const processRoute: ProcessRoute = (db, router, req, res, pid, checkKeys, checkId, getTargetUser) => {
    try {
        res.setHeader('pid', pid);

        const routerHash = router.getAllRoutes();

        const routeParams = req.url!.split('/') as string[];

        if (
            routeParams[1] === URL_CONSTANTS.DOMAIN_FIRST &&
			routeParams[2] === URL_CONSTANTS.DOMAIN_SECOND &&
			!routeParams[3]
        ) {
            const handler = routerHash.filter((route) => route.method === req.method && route.url.endsWith('s'))[0]
                .func;

            handler(db, req, res, checkKeys, checkId, getTargetUser);
            return;
        }

        if (
            routeParams[1] === URL_CONSTANTS.DOMAIN_FIRST &&
			routeParams[2] === URL_CONSTANTS.DOMAIN_SECOND &&
			routeParams[3]
        ) {
            const handler = routerHash.filter((route) => route.method === req.method && route.url.endsWith('s/'))[0]
                .func;

            return handler(db, req, res, checkKeys, checkId, getTargetUser);
        } else {
            res.statusCode = STATUS_CODE.NOT_FOUND;
            res.write(MESSAGES.NOT_FOUND);
            res.end();
        }
    } catch {
        res.statusCode = STATUS_CODE.SERVER_500;
        res.write(MESSAGES.SERVER_500);
    }
};
