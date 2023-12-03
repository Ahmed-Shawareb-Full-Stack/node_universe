import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserVerification } from './entities/user-verification';
import { Mail } from 'src/shared/services/mail/mail';
import { UserTokensDetails } from './entities/user-tokens-details';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserVerification, UserTokensDetails, Role]),
  ],
  providers: [
    UsersService,
    AuthService,
    Mail,
    JwtService,
    ConfigService,
    RolesService,
  ],
  controllers: [UsersController, AuthController, RolesController],
})
export class UsersModule {}
