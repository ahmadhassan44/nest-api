import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { SignOutDto } from './dto/signout.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signin(dto: SignInDto): Promise<Tokens>;
    signup(dto: SignUpDto): Promise<Tokens>;
    logout(body: SignOutDto): Promise<void>;
    generateTokens(email: string, roleId: number): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshTokenInDb(userId: number, refreshToken: string): Promise<void>;
}
