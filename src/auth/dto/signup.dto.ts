import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class SignUpDto{
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    username: string    

    @IsString()
    @IsNotEmpty()
    password: string
}