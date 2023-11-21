import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VerificationCase, VerificationType } from '../types/verification';

@Entity({
  name: 'UserVerification',
})
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
  })
  code: number;

  @Column({
    type: 'uuid',
  })
  userId: string;

  @Column({
    type: 'enum',
    enum: VerificationCase,
    array: true,
    nullable: false,
  })
  verificationCase: VerificationCase[];

  @Column({
    type: 'enum',
    enum: VerificationType,
    nullable: false,
  })
  verificationType: VerificationType;

  @CreateDateColumn()
  createdAt: Date;
}
