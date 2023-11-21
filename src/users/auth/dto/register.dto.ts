import { IsEmail, IsString, MinLength } from 'class-validator';
import { hashPassword } from 'src/shared/libs/hash-password';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  // @Transform((value: unknown) => (value as string)?.trim())
  firstName: string;

  @IsString()
  @MinLength(3)
  // @Transform((value: unknown) => (value as string)?.trim())
  lastName: string;

  @IsEmail()
  @MinLength(3)
  // @Transform((value: unknown) => (value as string)?.trim())
  email: string;

  @IsString()
  @MinLength(6)
  // @Transform((value: unknown) => (value as string)?.trim())
  password: string;
}
