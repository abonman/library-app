import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AuthTokenGuard } from '../auth/auth.token.guard';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { UserI } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Post('/')
    async create(@Body() createdUserDto: CreateUserDto): Promise<UserI> {
        return await this.usersService.create(createdUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginUserDto: LoginUserDto): Promise<Object> {
        return (await this.usersService.login(loginUserDto)).pipe(
            map((jwt: string) => {
                return {
                    access_token: jwt,
                    token_type: 'JWT',
                    expires_in: 10000
                }
            })
        );
    }

    @UseGuards(AuthTokenGuard)
    @Get('/')
    findAll(@Req() request): Promise<UserI[]> {
        return this.usersService.findAll();
    }

    @UseGuards(AuthTokenGuard)
    @Post('/:id/borrow/:bookid')
    async borrowBook(@Param() param): Promise<string> {
        const userId = param.id
        const bookId = param.bookid
        return this.usersService.borrowBook({ userId, bookId })
    }
}