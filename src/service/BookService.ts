import fs from "fs";
import { resolve } from "path";

export default class BookService {
  private static metas: { [bookId: string]: any } = {};
  private static metaFilePath = resolve(`./books/metas.json`);

  public static init() {
    const path = BookService.metaFilePath;
    const content = fs.readFileSync(path).toString();
    BookService.metas = JSON.parse(content);
  }

  public static async getBookMetas(bookIds: Array<string>): Promise<Array<{}>> {
    return bookIds.map((bookId) => BookService.metas[bookId]!);
  }

  public static async getBookMeta(bookId: string): Promise<{}> {
    return BookService.metas[bookId];
  }

  public static async exist(bookId: string): Promise<boolean> {
    return !!BookService.metas[bookId];
  }

  public static async getFullBook(bookId: string): Promise<{}> {
    if (bookId == 'metas') {
      throw new Error('book not found');
    }
    const bookFilePath = BookService.getBookFilePath(bookId);
    console.log(`read book[${bookId}] from ${bookFilePath}`);
    return new Promise(async (resolve, reject) => {
      const book = await BookService.getBookMeta(bookId);
      const full = JSON.parse(fs.readFileSync(bookFilePath).toString());
      full.book = book;
      resolve(full);
    })
  }

  public static async saveFullBook(bookId: string, fullBook: any) {
    if (bookId == 'metas') {
      throw new Error('book not found');
    }
    BookService.metas[bookId] = fullBook.book;
    const bookFilePath = BookService.getBookFilePath(bookId);
    return new Promise((resolve, reject) => {
      fs.writeFile(BookService.metaFilePath, JSON.stringify(BookService.metas), (err) => {
        err && console.error(err);
      });
      fs.writeFile(bookFilePath, JSON.stringify(fullBook), (err) => {
        err ? reject(err) : resolve();
      });
    })
  }

  private static getBookFilePath(bookId: string): string {
    return resolve(`./books/${bookId.replace('-', '')}.json`);
  }
}
