import { IsNotEmpty } from '@nestjs/class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
