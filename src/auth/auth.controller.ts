import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() body: SignUpDto): Promise<Tokens> {
    return this.authService.signup(body);
  }
  @Post('signin')
  signin(@Body() body: SignInDto): Promise<Tokens> {
    return this.authService.signin(body);
  }
}
