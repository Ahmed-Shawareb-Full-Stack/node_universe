import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerificationCase, VerificationType } from '../types/verification';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVerification } from '../entities/user-verification';
import { Repository } from 'typeorm';
import {
  DeviceType,
  Operations,
  TokenType,
  UserOperationsDetails,
} from '../entities/user-operations-details';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserVerification)
    private readonly userVerifyRepo: Repository<UserVerification>,
    @InjectRepository(UserOperationsDetails)
    private readonly userOperationsRepo: Repository<UserOperationsDetails>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(data: LoginDto) {
    const { email, password } = data;
    console.log(data);
  }

  async register(data: RegisterDto, operationDetails) {
    const user = await this.usersService.createUser(data);
    const operationResult = await this.registerUserOperationsDetails(
      user,
      operationDetails,
      Operations.REGISTER,
      TokenType.TEMP,
    );
  }

  async changePassword(data: ChangePasswordDto) {
    const { id, newPassword: password } = data;
    return this.usersService.updateUser({ id, password });
  }

  async sendUserVerification(
    verificationCase: VerificationCase[],
    verificationType: VerificationType,
    email = undefined,
    mobile = undefined,
  ) {
    if (email) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const { id: userId } = await this.usersService.findUser({ email });
      if (!userId) {
        throw new NotFoundException('user not found');
      }

      const userVerificationDataEntity = this.userVerifyRepo.save({
        code,
        userId,
        verificationCase,
        verificationType,
      });
    }
    if (mobile) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const { id: userId } = await this.usersService.findUser({ email });
      if (!userId) {
        throw new NotFoundException('user not found');
      }

      const userVerificationDataEntity = this.userVerifyRepo.save({
        code,
        userId,
        verificationCase,
        verificationType,
      });
    }
  }

  async verifyUser(
    code: number,
    userId: string,
    verificationCase: VerificationCase,
    verificationType: VerificationType,
  ) {}

  private verifyCodeGenerator() {}

  private async registerUserOperationsDetails(
    userData: User,
    data,
    operation: Operations,
    tokenType: TokenType,
  ) {
    console.log(data);
    const deviceIp = data['x-forwarded-for'];
    const userAgent = data['user-agent'];
    const tokenPayload = {
      sub: userData.id,
      email: userData.email,
    };
    const token = this.generateToken(tokenPayload);
    console.log(token);
  }

  private generateToken(payload) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get('PRIVATE_KEY'),
    });
  }
}
