import { Express, Request, Response } from 'express';
import limit from 'express-rate-limit';
import Utils from './Utils';

export default class HealthController {
  private static readonly heartbeatRateLimiter: limit.Instance = Utils.newRateLimiter(20);

  public static mount(server: Express) {
    server.get('/mpflpgaobfpjcpef/health', HealthController.heartbeatRateLimiter, HealthController.onRequest);
  }

  public static onRequest(req: Request, res: Response) {
    console.log(`${Utils.getIp(req)}: ${req.url}`);
    res.status(200).send('OK!');
  }
}
