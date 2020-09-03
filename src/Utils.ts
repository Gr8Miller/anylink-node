import { Request, Response } from 'express';
import limit from 'express-rate-limit';

export default class Utils {
  public static getIp(req: Request, res?: Response): string {
    return (req.headers['x-real-ip'] as string)
      || (req.headers['x-forwarded-for'] as string)
      || req.connection.remoteAddress || req.ip;
  }

  public static newRateLimiter(max: number, period: number = 60 * 1000): limit.Instance {
    return limit({
      max, // max per minute
      windowMs: period,
      message: 'Too many requests, please try again later.',
      keyGenerator: Utils.getIp
    })
  }
}
