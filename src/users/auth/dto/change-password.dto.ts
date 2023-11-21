import { IsString, IsUUID, MinLength } from 'class-validator';
import { MatchPassword } from 'src/shared/decorators/match-password';

export class ChangePasswordDto {
  @IsUUID(4)
  id: string;

  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @MinLength(6)
  @MatchPassword('newPassword')
  confirmPassword: string;

  @IsString()
  @MinLength(6)
  oldPassword: string;
}
