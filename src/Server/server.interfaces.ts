import http from 'http';

export interface IServer {
    listen: () => void
}

export type TServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export type TRequest = http.IncomingMessage;

export type TResponse = http.ServerResponse;