import cluster from 'cluster';
import os from 'os';
import { IUserRequest } from '../types/userTypes';

export const runClusters = (envPort: number, pid: number) => {
    const count = os.cpus().length;
    let port = envPort - 1;

    console.log(`\nActivated ${count} forks 🤖 \n`);
    console.log(`Primary pid: ${pid}`);

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