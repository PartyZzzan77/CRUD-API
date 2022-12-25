import { IUserRequest } from '../types/userTypes';
import { TServer } from './server.interfaces';

export const runServerListener = (server: TServer, host: string, port: number, pid: number) => {
    process.on('message', (data: IUserRequest[] | string) => {
        console.log('Primary to worker', data);
    });

    const envPort = Number(process.env['port']) || port;

    server.listen(envPort, host, () => {
        console.log('\x1b[35m', `🚀 server is running on ${'\x1b[32m'}${host}${'\x1b[35m'} : ${'\x1b[32m'}${envPort}${'\x1b[35m'} PID: ${'\x1b[32m'}${pid}`);
    });
};