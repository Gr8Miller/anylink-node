import express, { Express, NextFunction, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import limit from "express-rate-limit";
import { RequestOptions } from "http";

const script = 'document.addEventListener("DOMContentLoaded", () => {\n' +
  '  const j = document.createElement("script");\n' +
  '  const c = document.createElement("link");\n' +
  '  j.type = "text/javascript", j.src = "http://www.anyl.ink/mpflpgaobfpjcpef/viewer.js";\n' +
  '  c.rel = "stylesheet", c.href = "http://www.anyl.ink/mpflpgaobfpjcpef/viewer.css";\n' +
  '  document.head.append(c, j);\n' +
  '})';

function getIp(req: Request, res?: Response): string {
  return (req.headers['x-real-ip'] as string)
    || (req.headers['x-forwarded-for'] as string)
    || req.connection.remoteAddress || req.ip;
}

const proxyLimiter: limit.Instance = limit({
  windowMs: 60 * 1000,
  max: 8, // 8r at max per minute
  message: 'Too many requests, please try again later.',
  keyGenerator: getIp
});

const limiter: limit.Instance = limit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later.',
  keyGenerator: getIp
});

const server: Express = express();
server.get('/mpflpgaobfpjcpef/proxy/health', limiter, (req: Request, res: Response) => {
  console.log(`${getIp(req)}: ${req.url}`);
  res.status(200).send('OK!');
});
server.use('/mpflpgaobfpjcpef/proxy/:target', proxyLimiter, proxy((req: Request) => {
  const target = new URL(req.params.target);
  if (target.hostname === 'localhost' || target.hostname === '127.0.0.1') {
    throw new Error('invalid url');
  }
  console.log(`${getIp(req)}: proxying to ${target}`);
  return target.origin;
}, {
  limit: '5mb',
  memoizeHost: false,
  preserveHostHdr: true,
  filter: (req: Request, res: Response) => {
    return req.method == 'GET';
  },
  proxyReqPathResolver: function (req) {
    const target = new URL(req.params.target);
    return target.pathname + (target.search ? '?' + target.search : '');
  },
  proxyReqOptDecorator: function (proxyReqOpts: RequestOptions, req: Request) {
    const target = new URL(req.params.target);
    proxyReqOpts.headers!['host'] = target.host; // the host of certificate and that of request must match
    proxyReqOpts.headers!['url'] = target.href;
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes: Response, proxyResData: any, req: Request, res: Response) => {
    if (res.get('Content-Type').toLowerCase().includes('html')) {
      const target = new URL(req.params.target);
      let data = proxyResData.toString('utf8');
      data = data.replace('<head>', `<head><base href="${target.origin}/"><script>${script}</script>`);//inject js
      return data;
    }
    return proxyResData;
  },
  proxyErrorHandler: (err, res: Response, next: NextFunction) => {
    console.error(err);
    next(err);
  },
}));
const PROXY_PORT = 8001;
console.log('listening on port ' + PROXY_PORT);
server.listen(PROXY_PORT);
