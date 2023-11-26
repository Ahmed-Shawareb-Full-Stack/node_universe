import { IsEnum } from 'class-validator';
import {
  VerificationCase,
  VerificationType,
} from 'src/users/types/verification';

export class UserVerificationDTO {
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @IsEnum(VerificationCase)
  verificationCase: VerificationCase;
}
