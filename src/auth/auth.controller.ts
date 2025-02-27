import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types';
import { SignOutDto } from './dto/signout.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req): Promise<void> {
    const userId: number = req.user.userId;
    return this.authService.logout({ userId: userId });
  }
  // @Post('refresh')
  // refresh(@Body() req): Promise<Tokens> {
  //   return this.authService.refresh(req);
  // }
}
