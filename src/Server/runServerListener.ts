import { IUserRequest } from '../types/userTypes';
import { TServer } from './server.interfaces';

export const runServerListener = (server: TServer, host: string, port: number, pid: number) => {
    process.on('message', (data: IUserRequest[] | string) => {
        console.log('Primary to worker', data);
    });

    const envPort = Number(process.env['port']) || port;

    server.listen(envPort, host, () => {
        console.log(`✨server is running on ${host}:${envPort} PID: ${pid}`);
    });
};