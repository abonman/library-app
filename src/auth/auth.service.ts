import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { UserI } from 'src/users/users.interface';
const bcrypt = require("bcrypt");

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) { }

    async generateJwt(user: UserI): Promise<Observable<string>> {
        return from(this.jwtService.signAsync({ user }));
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async comparePasswords(password: string, storedPasswordHash: string): Promise<boolean> {
        return await bcrypt.compare(password, storedPasswordHash);
    }
}