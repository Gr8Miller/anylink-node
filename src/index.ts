import express, { Express } from 'express';
import ProxyController from './ProxyController';
import WebookController from './WebookController';

const server: Express = express();
ProxyController.mount(server);
WebookController.mount(server);
const PROXY_PORT = 8001;
console.log('listening on port ' + PROXY_PORT);
server.listen(PROXY_PORT);
