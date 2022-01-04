import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './books.schema';
import { BooksService } from './books.service';

@Module({
  imports:
    [HttpModule,
      MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])
    ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService]
})
export class BooksModule { }
