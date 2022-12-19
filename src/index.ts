
import { App } from './App/App.js';
import Router from './Router/Router.js';
import Server from './Server/Server.js';

const app = new App(new Server(new Router()));

app.run();