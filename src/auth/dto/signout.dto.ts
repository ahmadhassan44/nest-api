import { IsNotEmpty, IsNumber } from 'class-validator';

export class SignOutDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
