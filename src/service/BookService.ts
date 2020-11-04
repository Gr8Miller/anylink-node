import fs from "fs";
import { resolve } from "path";

export default class BookService {
  private static metas: { [bookId: string]: any } = {};
  private static metaFilePath = resolve(`./books/metas.json`);

  public static init() {
    const path = BookService.metaFilePath;
    console.log(new Date().toISOString(), `BookService.init(${path})`);
    if (fs.existsSync(path)) {
      console.log(new Date().toISOString(), `BookService.init(${path})=meta file found`);
      const content = fs.readFileSync(path).toString();
      if (content) {
        console.log(new Date().toISOString(), `BookService.init(${path})=meta file length:${content.length}`);
      }
      BookService.metas = JSON.parse(content);
    }
  }

  public static async getBookMetas(bookIds: Array<string>): Promise<Array<{}>> {
    console.log(new Date().toISOString(), `BookService.getBookMetas(${bookIds})`);
    return bookIds.map((bookId) => BookService.metas[bookId]!);
  }

  public static async getBookMeta(bookId: string): Promise<{}> {
    console.log(new Date().toISOString(), `BookService.getBookMeta(${bookId})`);
    return BookService.metas[bookId];
  }

  public static async exist(bookId: string): Promise<boolean> {
    console.log(new Date().toISOString(), `BookService.exit(${bookId})`);
    return !!BookService.metas[bookId];
  }

  public static async getFullBook(bookId: string): Promise<{}> {
    console.log(new Date().toISOString(), `BookService.getFullBook(${bookId})`);
    if (bookId == 'metas') {
      throw new Error('book not found');
    }
    const bookFilePath = BookService.getBookFilePath(bookId);
    console.log(new Date().toISOString(), `BookService.getFullBook(${bookId}) from ${bookFilePath}`);
    return new Promise(async (resolve, reject) => {
      const book = await BookService.getBookMeta(bookId);
      const full = JSON.parse(fs.readFileSync(bookFilePath).toString());
      full.book = book;
      resolve(full);
    })
  }

  public static async saveFullBook(bookId: string, fullBook: any) {
    console.log(new Date().toISOString(), `BookService.saveFullBook(${bookId})`);
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
