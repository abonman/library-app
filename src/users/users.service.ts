import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { Book, BookDocument } from 'src/books/books.schema';
import { BooksService } from 'src/books/books.service';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto, CreateUserDto } from './dto/user.dto';
import { UserI } from './users.interface';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name)
        private readonly usermodel: Model<UserDocument>,
        @InjectModel(Book.name)
        private readonly bookmodel: Model<BookDocument>,
        private authService: AuthService,
        private bookService: BooksService
    ) { }

    async create(createdUserDto: CreateUserDto): Promise<UserI> {
        const exists = await this.mailExists(createdUserDto.email)
        if (!exists) {
            const pwd = await this.authService.hashPassword(createdUserDto.password)
            console.log("pwd", pwd)
            createdUserDto.password = pwd

            return await new this.usermodel({
                ...createdUserDto,
                createdAt: new Date(),
                books: {
                    past: [] as unknown as Book,
                    present: [] as unknown as Book
                }
            }).save();

        } else {
            throw new HttpException('Email already in use', HttpStatus.CONFLICT);
        }

    }

    async login(loginUserDto: LoginUserDto): Promise<Observable<string>> {
        const user = await this.findUserByEmail(loginUserDto.email)

        if (user) {
            const passwordsMatches = this.validatePassword(loginUserDto.password, user.password)
            if (passwordsMatches) {
                return this.authService.generateJwt(user)
            } else {
                throw new HttpException('Login was not Successfulll', HttpStatus.UNAUTHORIZED);
            }
        } else {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }


    }

    async findAll(): Promise<UserI[]> {
        try {
            return await this.usermodel.find();
        } catch (error) {
            console.error(error)
        }
    }

    async findOne(_id: number): Promise<UserI> {
        try {
            return this.usermodel.findOne({ _id });
        } catch (error) {
            console.error(error)
        }
    }

    private async findUserByEmail(email: string): Promise<UserI> {
        try {
            return this.usermodel.findOne({ email }, { select: ['email', 'username', 'password'] });
        } catch (error) {
            console.error(error)
        }
    }

    private validatePassword(password: string, storedPasswordHash: string): Promise<boolean> {
        try {
            return this.authService.comparePasswords(password, storedPasswordHash);
        } catch (error) {
            console.error(error)
        }
    }

    async mailExists(email: string): Promise<boolean> {
        try {
            const user = await this.usermodel.findOne({ email: email })
            return user ? true : false
        } catch (error) {
            console.error(error)
        }

    }

    async borrowBook(_request: { userId: string, bookId: string }): Promise<any> {
        try {
            let book = null
            let bookFromDb = await this.bookmodel.findOne({ bookId: _request.bookId });
            if (!bookFromDb) {
                book = await this.bookService.getBookById(_request.bookId)
            } else if (bookFromDb.Istaken) {
                return new HttpException('Book already in use', HttpStatus.CONFLICT);
            } else {
                book = bookFromDb
            }

            if (!book) {
                return new HttpException('Book not found', HttpStatus.NOT_FOUND);
            }

            const user = await this.usermodel.findById({ _id: _request.userId });
            if (!user) {
                return new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const bookNew = new Book(book.bookId, book.name, 0, true)
            console.log(bookNew)
            await new this.bookmodel({ ...bookNew }).save()
            user.books.present.push(bookNew)
            return await user.save();


        } catch (error) {
            console.error(error)
        }


    }

}