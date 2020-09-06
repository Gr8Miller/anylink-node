import express, { Express } from 'express';
import ProxyController from './ProxyController';
import WebookController from './WebookController';
import HealthController from './HealthController';

const server: Express = express();
HealthController.mount(server);
ProxyController.mount(server);
WebookController.mount(server);
const PROXY_PORT = 8001;
console.log('listening on port ' + PROXY_PORT);
server.listen(PROXY_PORT);
