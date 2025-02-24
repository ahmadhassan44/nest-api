import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class SignUpDto{
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsOptional()
    lastName: string

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