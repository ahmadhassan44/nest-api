import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    signin(dto: SignInDto): Promise<string>;
    signup(dto: SignUpDto): Promise<Object>;
}
