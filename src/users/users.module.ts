import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserVerification } from './entities/user-verification';
import { Mail } from 'src/shared/services/mail/mail';
import { UserOperationsDetails } from './entities/user-operations-details';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserVerification, UserOperationsDetails]),
  ],
  providers: [UsersService, AuthService, Mail, JwtService, ConfigService],
  controllers: [UsersController, AuthController],
})
export class UsersModule {}
