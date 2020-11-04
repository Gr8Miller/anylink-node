import express, { Express, Request, Response } from 'express';
import limit from 'express-rate-limit';
import Utils from './Utils';
import BookService from './service/BookService';

export default class WebookController {
  private static readonly getLimiter: limit.Instance = Utils.newRateLimiter(8);
  private static readonly putLimiter: limit.Instance = Utils.newRateLimiter(4);

  public static mount(server: Express) {
    BookService.init();

    server.post('/mpflpgaobfpjcpef/book/meta',
      WebookController.getLimiter,
      express.json(),
      WebookController.getBookMetas);
    server.get('/mpflpgaobfpjcpef/book/:bookId/meta',
      WebookController.getLimiter,
      WebookController.getBookMeta);
    server.get('/mpflpgaobfpjcpef/book/:bookId',
      WebookController.getLimiter,
      WebookController.getFullBook);
    server.put('/mpflpgaobfpjcpef/book/:bookId',
      WebookController.putLimiter,
      express.json(),
      WebookController.saveFullBook);
  }

  private static async getFullBook(req: Request, res: Response) {
    const { bookId } = req.params;
    console.log(new Date().toISOString(), Utils.getIp(req), `getFullBook(${bookId})`);
    if (await BookService.exist(bookId)) {
      const fullBook = await BookService.getFullBook(bookId);
      console.log(new Date().toISOString(), Utils.getIp(req), `getFullBook(${bookId})=200`);
      res.status(200).json(fullBook);
    } else {
      console.log(new Date().toISOString(), Utils.getIp(req), `getFullBook(${bookId})=404`);
      res.status(404).send();
    }
  }

  private static async getBookMetas(req: Request, res: Response) {
    const { bookIds } = req.body;
    console.log(new Date().toISOString(), Utils.getIp(req), `getBookMetas(${bookIds})`);
    const metas = await BookService.getBookMetas(bookIds);
    console.log(new Date().toISOString(), Utils.getIp(req), `getBookMetas(${bookIds})=200`);
    res.status(200).json(metas);
  }

  private static async getBookMeta(req: Request, res: Response) {
    const { bookId } = req.params;
    console.log(new Date().toISOString(), Utils.getIp(req), `getBookMeta(${bookId})`);
    const metas = await BookService.getBookMetas([bookId]);
    if (metas.length > 0) {
      console.log(new Date().toISOString(), Utils.getIp(req), `getBookMeta(${bookId})=200`);
      res.status(200).json(metas[0]);
    } else {
      console.log(new Date().toISOString(), Utils.getIp(req), `getBookMeta(${bookId})=404`);
      res.status(404).send();
    }
  }

  private static async saveFullBook(req: Request, res: Response) {
    const { bookId } = req.params;
    console.log(new Date().toISOString(), Utils.getIp(req), `saveFullBook(${bookId})`);
    const fullBook = req.body;
    await BookService.saveFullBook(bookId, fullBook);
    console.log(new Date().toISOString(), Utils.getIp(req), `saveFullBook(${bookId})=200`);
    res.status(200).json({ bookId });
  }
}
