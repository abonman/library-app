import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { BookApi, Ifields } from './books.api.model'
import { BookResult } from './dto/books.dto';
import { Book, BookDocument } from './books.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class BooksService {

    constructor(
        @InjectModel(Book.name)
        private readonly model: Model<BookDocument>,
        private requestService: HttpService
    ) { }

    async getBook(body: Ifields): Promise<any> {
        const book = new BookApi()
        book.setQuery(body)
        try {
            const res = await firstValueFrom(this.requestService.get(book.url).
                pipe(
                    map((resp) => { return resp.data.items })
                ))
            if (!res) {
                throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
            }
            const books: BookResult[] = res.map((book: { [x: string]: { [x: string]: any; }; }) => {
                return { "id": book["id"], "name": book["volumeInfo"]["title"] }
            })
            return books

        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(book.url, e);
        }

    }

    async getBookById(bookId: string): Promise<BookResult> {
        const book = new BookApi()
        book.setBookId(bookId)
        try {
            const res = await firstValueFrom(this.requestService.get(book.url).pipe(map((resp) => { return resp.data })))
            return { "bookId": res["id"], "name": res["volumeInfo"]["title"] }
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(book.url, e);
        }
    }

}
