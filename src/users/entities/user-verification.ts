import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VerificationCase, VerificationType } from '../types/verification';
import { User } from './user.entity';

@Entity({
  name: 'UserVerification',
})
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 6,
  })
  code: string;

  @Column({
    type: 'enum',
    enum: VerificationCase,
  })
  verificationCase: VerificationCase;

  @Column({
    type: 'enum',
    enum: VerificationType,
  })
  verificationType: VerificationType;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.userVerificationCodes)
  user: User;
}
