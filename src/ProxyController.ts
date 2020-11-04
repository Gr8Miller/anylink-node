import { Express, NextFunction, Request, Response } from 'express';
import limit from 'express-rate-limit';
import proxy, { ProxyOptions } from 'express-http-proxy';
import { RequestOptions } from "http";
import Utils from './Utils';

export default class ProxyController {
  private static readonly script: string = `
    document.addEventListener("DOMContentLoaded", () => {
      const j = document.createElement("script");
      const c = document.createElement("link");
      j.type = "text/javascript", j.src = "https://gr8miller.github.io/proxy/viewer.js";
      c.rel = "stylesheet", c.href = "https://gr8miller.github.io/proxy/viewer.css";
      document.head.append(c, j);
    })`;

  private static readonly proxyRateLimiter: limit.Instance = Utils.newRateLimiter(8);
  private static readonly heartbeatRateLimiter: limit.Instance = Utils.newRateLimiter(20);

  private static readonly proxyOptions: ProxyOptions = {
    limit: '5mb',
    memoizeHost: false,
    preserveHostHdr: true,
    userResDecorator: ProxyController.onProxyResponse,
    proxyErrorHandler: ProxyController.onProxyError,
    filter: (req: Request, res: Response) => {
      return req.method == 'GET';
    },
    proxyReqPathResolver: function (req: Request) {
      const target = new URL(req.params.target);
      return target.pathname + (target.search ? '?' + target.search : '');
    },
    proxyReqOptDecorator: function (options: RequestOptions, req: Request) {
      const target = new URL(req.params.target);
      options.headers!['host'] = target.host; // the host of certificate and that of request must match
      options.headers!['url'] = target.href;
      return options;
    },
  }

  public static mount(server: Express) {
    server.get('/mpflpgaobfpjcpef/proxy/health', ProxyController.heartbeatRateLimiter, ProxyController.onHealthRequest);
    server.use('/mpflpgaobfpjcpef/proxy/:target', ProxyController.proxyRateLimiter, proxy(ProxyController.onProxyRequest, ProxyController.proxyOptions));
  }

  public static onHealthRequest(req: Request, res: Response) {
    console.log(`${Utils.getIp(req)}: ${req.url}`);
    res.status(200).send('OK!');
  }

  public static onProxyRequest(req: Request): string {
    const target = new URL(req.params.target);
    if (target.hostname === 'localhost' || target.hostname === '127.0.0.1') {
      throw new Error('invalid url');
    }
    console.log(`${Utils.getIp(req)}: proxying to ${target}`);
    return target.origin;
  }

  public static onProxyResponse(proxyRes: Response, proxyResData: any, req: Request, res: Response) {
    if (res.get('Content-Type').toLowerCase().includes('html')) {
      const target = new URL(req.params.target);
      let data = proxyResData.toString('utf8');
      data = data.replace('<head>', `<head><base href="${target.origin}/"><script>${ProxyController.script}</script>`);//inject js
      return data;
    }
    return proxyResData;
  }

  public static onProxyError(err: any, res: Response, next: NextFunction) {
    console.error(err);
    next(err);
  }
}
