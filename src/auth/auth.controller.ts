import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto,SignUpDto } from "./dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}
    @Post("signup")
    signup(@Body() body:SignUpDto) {
        return this.authService.signup(body)
    }
    @Post("signin")
    signin(@Body() body:SignInDto){
        return this.authService.signin(body)
    }
}