import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { SignOutDto } from './dto/signout.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signin(@Body() dto: SignInDto): Promise<Tokens> {
    //find the user by email or username provided in dto
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.usernameOrEmail }, { username: dto.usernameOrEmail }],
      },
    });
    //if user is not found, throw an error
    if (!user) throw new ForbiddenException('User does not exist');

    //compare the password provided in dto with the hash stored in the database
    const match = await argon.verify(user.hash, dto.password);
    if (!match) throw new ForbiddenException('Invalid password');
    else {
      const tokens: Tokens = await this.generateTokens(user.email, user.id);
      await this.updateRefreshTokenInDb(user.id, tokens.refreshToken);
      return tokens;
    }
  }

  async signup(@Body() dto: SignUpDto): Promise<Tokens> {
    //generate hash for password
    const hash: string = await argon.hash(dto.password);

    //save user to database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          createdAt: true,
        },
      });
      const tokens: Tokens = await this.generateTokens(user.email, user.id);
      await this.updateRefreshTokenInDb(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exists');
        }
      }
      throw error;
    }
  }
  async logout(@Body() body: SignOutDto): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: body.userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }
  // async refresh(@Body() req): Promise<Tokens> {}

  async generateTokens(email: string, roleId: number) {
    const [at, rt]: Array<string> = await Promise.all([
      this.jwtService.sign(
        {
          sub: email,
          roleId,
        },
        { expiresIn: '15m', secret: process.env.JWT_AT_SECRET },
      ),
      this.jwtService.sign(
        {
          sub: email,
          roleId,
        },
        { expiresIn: '7d', secret: process.env.JWT_RT_SECRET },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  async updateRefreshTokenInDb(userId: number, refreshToken: string) {
    const hashedRt: string = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hashedRt },
    });
  }
}
