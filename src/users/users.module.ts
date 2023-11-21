import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserVerification } from './entities/user-verification';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserVerification])],
  providers: [UsersService, AuthService],
  controllers: [UsersController, AuthController],
})
export class UsersModule {}
