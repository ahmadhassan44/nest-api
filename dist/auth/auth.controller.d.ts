import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types';
import { SignOutDto } from './dto/signout.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: SignUpDto): Promise<Tokens>;
    signin(body: SignInDto): Promise<Tokens>;
    logout(body: SignOutDto): Promise<void>;
}
