import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}
    @Post("signup")
    signup(@Body() body:AuthDto){
        this.authService.signup()
    }
    @Post("signin")
    signin(@Body() body:AuthDto){
        this.authService.signin()
    }
}