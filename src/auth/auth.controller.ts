import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}
    @Post("signup")
    signup(@Body() body:any){
        this.authService.signup()
    }
    @Post("signin")
    signin(@Body() body:any){
        this.authService.signin()
    }
}