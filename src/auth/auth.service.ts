import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signin(@Body() dto: SignInDto): Promise<AuthResponse> {
    // Find the user by email or username provided in dto
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.usernameOrEmail }, { username: dto.usernameOrEmail }],
      },
    });

    // If user is not found, throw an error
    if (!user) throw new ForbiddenException('User does not exist');

    // Compare the password provided in dto with the hash stored in the database
    const match = await argon.verify(user.hash, dto.password);
    if (!match) throw new ForbiddenException('Invalid password');

    // Generate tokens
    const tokens = await this.generateTokens(user.email, user.roleId, user.id);
    await this.updateRefreshTokenInDb(user.id, tokens.refreshToken);

    // Return comprehensive response
    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      meta: {
        issued: new Date().toISOString(),
        serverTime: new Date().toISOString()
      }
    };
  }

  async signup(@Body() dto: SignUpDto): Promise<AuthResponse> {
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
          roleId: dto.roleId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          roleId: true,
        },
      });
      const tokens = await this.generateTokens(
        user.email,
        user.roleId,
        user.id,
      );
      await this.updateRefreshTokenInDb(user.id, tokens.refreshToken);
      
      return {
        tokens,
        user,
        meta: {
          issued: new Date().toISOString(),
          serverTime: new Date().toISOString()
        }
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exists');
        }
      }
      throw error;
    }
  }

  async logout({ userId }: { userId: number }): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refresh({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }): Promise<AuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
    });
    if (!user) throw new ForbiddenException('Invalid refresh token');
    const match = await argon.verify(user.hashedRt, refreshToken);
    if (!match) throw new ForbiddenException('Invalid refresh token');
    
    const tokens = await this.generateTokens(
      user.email,
      user.roleId,
      user.id,
    );
    await this.updateRefreshTokenInDb(user.id, tokens.refreshToken);
    
    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      meta: {
        issued: new Date().toISOString(),
        serverTime: new Date().toISOString()
      }
    };
  }

  async generateTokens(email: string, roleId: number, userId: number): Promise<Tokens> {
    const [at, rt]: Array<string> = await Promise.all([
      this.jwtService.sign(
        {
          sub: email,
          roleId,
          userId: userId,
        },
        { expiresIn: '15m', secret: process.env.JWT_AT_SECRET },
      ),
      this.jwtService.sign(
        {
          sub: email,
          roleId,
          userId: userId,
        },
        { expiresIn: '7d', secret: process.env.JWT_RT_SECRET },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt
    };
  }

  async updateRefreshTokenInDb(userId: number, refreshToken: string) {
    const hashedRt: string = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hashedRt },
    });
  }
}
