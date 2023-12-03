import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TokenType {
  TEMP = 'TEMP',
  LOGIN = 'LOGIN',
}

export enum DeviceType {
  ANDROID = 'ANDROID',
  DESKTOP = 'DESKTOP',
}

export enum Operations {
  LOGIN_IN = 'LOGIN_IN',
  REGISTER = 'REGISTER',
}

@Entity({
  name: 'UserTokensDetails',
})
export class UserTokensDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
  })
  device: DeviceType;

  @Column({
    type: 'varchar',
  })
  deviceIP: string;

  @Column({
    type: 'text',
  })
  userAgent: string;

  @Column({
    type: 'enum',
    enum: Operations,
  })
  operation: Operations;

  @Column({
    type: 'text',
  })
  token: string;

  @Column({
    type: 'enum',
    enum: TokenType,
  })
  tokenType: TokenType;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.UserTokensDetails, {
    onDelete: 'CASCADE',
  })
  user: User;
}