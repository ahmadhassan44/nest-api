import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class SignInDto{
    @IsEmail()
    @IsNotEmpty()
    usernameOrEmail: string

    @IsString()
    @IsNotEmpty()
    password: string
}
