
import { App } from './App/App.js';
import Router from './Router/Router.js';
import Server from './Server/Server.js';
import {db} from './DB/DB.js';

console.log(db.getAllUsers());


const app = new App(new Server(new Router(), db));

app.run();
