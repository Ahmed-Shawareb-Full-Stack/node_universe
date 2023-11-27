import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { hashPassword } from 'src/shared/libs/hash-password';
import { DeviceType } from 'src/users/entities/user-tokens-details';

export class RegisterDTO {
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
  @IsOptional()
  // @Transform((value: unknown) => (value as string)?.trim())
  email: string;

  @IsString()
  @MinLength(13)
  @IsOptional()
  mobile: string;

  @IsString()
  @MinLength(6)
  // @Transform((value: unknown) => (value as string)?.trim())
  password: string;

  @IsEnum(DeviceType)
  device: DeviceType;
}
