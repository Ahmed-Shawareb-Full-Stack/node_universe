import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { DeviceType } from 'src/users/entities/user-tokens-details';

export class LoginDTO {
  @IsEmail()
  @MinLength(3)
  // @Transform((value: unknown) => (value as string)?.trim())
  email: string;

  @IsString()
  @MinLength(6)
  // @Transform((value: unknown) => (value as string)?.trim())
  password: string;

  @IsEnum(DeviceType)
  device: DeviceType;
}
