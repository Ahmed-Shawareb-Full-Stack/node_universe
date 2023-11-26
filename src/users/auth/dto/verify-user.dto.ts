import { IsEnum, IsString, Length } from 'class-validator';
import {
  VerificationCase,
  VerificationType,
} from 'src/users/types/verification';

export class VerifyUserDTO {
  @IsString()
  @Length(6)
  code: string;

  @IsEnum(VerificationCase)
  verificationCase: VerificationCase;

  @IsEnum(VerificationType)
  verificationType: VerificationType;
}
