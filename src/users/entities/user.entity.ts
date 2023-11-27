import {
  AfterInsert,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTokensDetails } from './user-tokens-details';
import { UserVerification } from './user-verification';

@Entity({
  name: 'Users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  firstName: string;

  @Column({
    type: 'varchar',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
    default: null,
  })
  email: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerifiedEmail: boolean;

  // @Column({
  //   type: 'varchar',
  //   unique: true,
  //   default: null,
  // })
  // mobile: string;

  // @Column({
  //   type: 'boolean',
  //   default: false,
  // })
  // isVerifiedMobile: boolean;

  @Column({
    type: 'text',
  })
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: Date;

  @OneToMany(
    () => UserTokensDetails,
    (UserTokensDetails) => UserTokensDetails.user,
  )
  UserTokensDetails: UserTokensDetails[];

  @OneToMany(
    () => UserVerification,
    (userVerification) => userVerification.user,
  )
  userVerificationCodes: UserVerification[];
}
