import { Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}
    @Post("signup")
    signup(@Req() request:Request){
        this.authService.signup()
    }
    @Post("signin")
    signin(@Req() request:Request){
        this.authService.signin()
    }
}