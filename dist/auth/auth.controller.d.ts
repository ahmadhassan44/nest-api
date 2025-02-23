import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: any): void;
    signin(body: any): void;
}
