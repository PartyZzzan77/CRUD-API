import { ProcessRoute } from './server.interfaces';

export const processRoute: ProcessRoute = (db, router, req, res, pid, checkKeys, checkId, getTargetUser) => {
    try {
        res.setHeader('pid', pid);

        const routerHash = router.getAllRoutes();

        const routeParams = req.url!.split('/') as string[];

        if (routeParams[1] === 'api' && routeParams[2] === 'users' && !routeParams[3]) {
            const handler = routerHash.filter(route => route.method === req.method && route.url.endsWith('s'))[0].func;

            handler(db, req, res, checkKeys, checkId, getTargetUser);
            return;
        }

        if (routeParams[1] === 'api' && routeParams[2] === 'users' && routeParams[3]) {
            const handler = routerHash.filter(route => route.method === req.method && route.url.endsWith('s/'))[0].func;

            return handler(db, req, res, checkKeys, checkId, getTargetUser);

        } else {
            res.statusCode = 404;
            res.write('Not found');
            res.end();
        }
    } catch {
        res.statusCode = 500;
        res.write('server internal error 500');
    }
};