import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(request: Request): void;
    signin(request: Request): void;
}
