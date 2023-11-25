import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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
  name: 'UserOperationsDetails',
})
export class UserOperationsDetails {
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
    type: 'varchar',
  })
  userAgent: string;

  @Column({
    type: 'enum',
    enum: Operations,
  })
  operation: Operations;

  @Column({
    type: 'varchar',
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

  @ManyToOne(() => User, (user) => user.userOperationsDetails)
  user: User;
}
