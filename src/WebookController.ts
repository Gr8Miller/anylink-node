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
    const fullBook = await BookService.getFullBook(bookId);
    res.status(200).json(fullBook);
  }

  private static async getBookMetas(req: Request, res: Response) {
    const { bookIds } = req.body;
    const metas = await BookService.getBookMetas(bookIds);
    res.status(200).json(metas);
  }

  private static async getBookMeta(req: Request, res: Response) {
    const { bookId } = req.params;
    const metas = await BookService.getBookMetas([bookId]);
    if (metas.length > 0) {
      res.status(200).json(metas[0]);
    } else {
      res.status(404).send();
    }
  }

  private static async saveFullBook(req: Request, res: Response) {
    const { bookId } = req.params;
    const fullBook = req.body;
    console.log(`save book[${bookId}]`);
    fullBook.book.updateAt = Date.now();
    await BookService.saveFullBook(bookId, fullBook);
    res.status(200).json({ bookId });
  }
}
