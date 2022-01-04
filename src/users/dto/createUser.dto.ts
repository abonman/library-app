import { IsDate, IsDateString, IsString } from "class-validator";
import { LoginUserDto } from "./LoginUser.dto";


export class CreateUserDto extends LoginUserDto {

    @IsString()
    name: string;
    @IsString()
    username: string;
    @IsDate()
    createdAt:Date;
    
}