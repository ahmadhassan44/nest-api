import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}
    @Post("signup")
    signup(){
        console.log("Signup called")
    }
    @Post("signin")
    signin(){
        console.log("Signin called")
    }
}