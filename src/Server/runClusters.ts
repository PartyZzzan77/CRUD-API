import cluster from 'cluster';
import os from 'os';
import { IUserRequest } from '../types/userTypes';

export const runClusters = (envPort: number, pid: number) => {
    const count = os.cpus().length;
    let port = envPort - 1;

    console.log('\x1b[35m', `\n 🤖 activated ${'\x1b[32m'}${count}${'\x1b[35m'} forks \n`);
    console.log('\x1b[33m', `primary pid: ${'\x1b[32m'}${pid}`);

    for (let i = 0; i < count; i++) {
        port++;
        const worker = cluster.fork({ port });

        worker.on('exit', () => {
            console.log(`PID died:${worker.process.pid}`);
            port++;
            cluster.fork({ port });
        });

        worker.on('message', (data: IUserRequest[] | string) => {
            console.log('Worker to Primary', data);
            worker.send(data);
        });
    }
};
