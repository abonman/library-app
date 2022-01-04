import { MongoModule } from './mongo/mongo.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { BooksModule } from './books/books.module';
import { BooksController } from './books/books.controller';

@Module({
  imports: [MongoModule, ConfigModule.forRoot({
    isGlobal: true
  }), UsersModule, AuthModule, BooksModule],
  controllers: [AppController,UsersController,BooksController],
  providers: [AppService],
})
export class AppModule { }
