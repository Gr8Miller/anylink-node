import { Express, Request, Response } from 'express';
import limit from 'express-rate-limit';
import Utils from './Utils';
import fs from 'fs';
import { resolve } from 'path';

export default class WebookController {
  private static readonly getLimiter: limit.Instance = Utils.newRateLimiter(8);
  private static readonly putLimiter: limit.Instance = Utils.newRateLimiter(4);

  public static mount(server: Express) {
    server.get('/mpflpgaobfpjcpef/webook/:bookId', WebookController.getLimiter, WebookController.getBook);
    server.put('/mpflpgaobfpjcpef/webook/:bookId', WebookController.putLimiter, WebookController.putBook);
  }

  private static getBook(req: Request, res: Response) {
    const { bookId } = req.params;
    const bookFilePath = WebookController.getBookFilePath(bookId);
    console.log(`read book[${bookId}] from ${bookFilePath}`);
    const content = JSON.parse(fs.readFileSync(bookFilePath).toString());
    res.status(200).json(content);
  }

  private static putBook(req: Request, res: Response) {
    const { bookId } = req.params;
    const bookFilePath = WebookController.getBookFilePath(bookId);
    console.log(`write book[${bookId}] into ${bookFilePath}`);
    const content = req.body;
    fs.writeFile(bookFilePath, content, (err) => {
      err && console.error(err);
    });
    res.status(200).json({ bookId });
  }

  private static getBookFilePath(bookId: string) {
    return resolve(`./books/${bookId.replace('-', '')}.json`);
  }
}
