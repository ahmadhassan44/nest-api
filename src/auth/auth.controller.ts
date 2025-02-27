import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types';
import { SignOutDto } from './dto/signout.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: SignUpDto): Promise<Tokens> {
    return this.authService.signup(body);
  }
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() body: SignInDto): Promise<Tokens> {
    return this.authService.signin(body);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() body: SignOutDto): Promise<void> {
    return this.authService.logout(body);
  }
  // @Post('refresh')
  // refresh(@Body() req): Promise<Tokens> {
  //   return this.authService.refresh(req);
  // }
}
