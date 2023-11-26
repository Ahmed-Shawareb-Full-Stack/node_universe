import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @MinLength(3)
  // @Transform((value: unknown) => (value as string)?.trim())
  email: string;

  @IsString()
  @MinLength(6)
  // @Transform((value: unknown) => (value as string)?.trim())
  password: string;
}
