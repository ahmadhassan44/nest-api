import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: SignUpDto): Promise<Object>;
    signin(body: SignInDto): Promise<string>;
}
