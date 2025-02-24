import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signin(@Body() dto: SignInDto) {
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
    else return 'User authenticated!';
  }

  async signup(@Body() dto: SignUpDto) {
    //generate hash for password
    const hash: string = await argon.hash(dto.password);

    //save user to database
    try {
      const user: Object = await this.prisma.user.create({
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

      //return user so that we can log them in
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exists');
        }
      }
      throw error;
    }
  }
}
