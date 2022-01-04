import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/auth.token.guard';
import { Ifields } from './books.api.model';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
    constructor(private bookService: BooksService) {

    }
    @UseGuards(AuthTokenGuard)
    @Post('/')
    async getBook(@Body() body: Ifields): Promise<any> {
        return this.bookService.getBook(body)
    }

    @UseGuards(AuthTokenGuard)
    @Get('/:id')
    async getBookById(@Param() params): Promise<any> {
        return this.bookService.getBookById(params.id)
    }
}
