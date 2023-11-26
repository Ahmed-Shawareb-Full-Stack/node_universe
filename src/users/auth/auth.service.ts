import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
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
import { Mail } from 'src/shared/services/mail/mail';

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
    private readonly mailService: Mail,
  ) {}

  async login(data: LoginDTO) {
    const { email, password } = data;
    console.log(data);
  }

  async register(data: RegisterDTO, operationDetails) {
    const user = await this.usersService.createUser(data);
    const operationResult = await this.registerUserOperationsDetails(
      user,
      operationDetails,
      Operations.REGISTER,
      TokenType.TEMP,
      data.device,
    );
    return {
      operationResult,
    };
  }

  async changePassword(data: ChangePasswordDTO) {
    const { id, newPassword: password } = data;
    return this.usersService.updateUser({ id, password });
  }

  async sendUserVerification(
    verificationCase: VerificationCase,
    verificationType: VerificationType,
    token: string,
  ) {
    const jwtToken = token.split(' ')[1];
    const tokenPayload = this.jwtService.decode(jwtToken);
    const userTokens = await this.userOperationsRepo.findBy({
      userId: tokenPayload.userId,
    });
    if (!userTokens && !userTokens.length) {
      throw new NotFoundException('user token not found');
    }
    if (
      (tokenPayload.email && verificationType === VerificationType.MOBILE) ||
      (tokenPayload.mobile && verificationType === VerificationType.EMAIL)
    ) {
      throw new ForbiddenException(
        'invalid verification case or verification type',
      );
    }
    if (
      verificationCase === VerificationCase.REGISTER &&
      (userTokens.length !== 1 || userTokens[0].operation !== 'REGISTER')
    ) {
      throw new ForbiddenException(
        'Some thing is wrong with the verification process',
      );
    }
    if (tokenPayload.email) {
      const code = Math.floor(100000 + Math.random() * 900000).toFixed(0);
      const user = await this.usersService.findUser({
        email: tokenPayload.email,
      });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      const userVerificationDataEntity = this.userVerifyRepo.create({
        verificationCase,
        verificationType,
        user,
        code,
      });
      const userVerificationData = await this.userVerifyRepo.save(
        userVerificationDataEntity,
      );
      await this.mailService.send({
        to: tokenPayload.email,
        html: `Your verification code is ${userVerificationData.code}`,
      });
    }
    // if (mobile) {
    //   const code = Math.floor(100000 + Math.random() * 900000);
    //   const { id: userId } = await this.usersService.findUser({ email });
    //   if (!userId) {
    //     throw new NotFoundException('user not found');
    //   }
    //   const userVerificationDataEntity = this.userVerifyRepo.save({
    //     code,
    //     userId,
    //     verificationCase,
    //     verificationType,
    //   });
    // }
  }

  async verifyUser(
    code: string,
    headersData: string,
    verificationCase: VerificationCase,
    verificationType: VerificationType,
  ) {
    const jwtToken = headersData['authorization'].split(' ')[1];
    const tokenPayload = await this.verifyToken(jwtToken);
    console.log(tokenPayload);
    const userVerificationDetails = await this.userVerifyRepo.find({
      where: {
        userId: tokenPayload.userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    console.log(userVerificationDetails);
    if (!userVerificationDetails.length) {
      throw new NotFoundException('user verification details not found');
    }
    if (userVerificationDetails && userVerificationDetails.length > 1) {
      const pastCodes = userVerificationDetails.splice(1);
      await this.userVerifyRepo.remove(pastCodes);
    }

    const now = new Date().getTime();
    const codeCreatedAt = new Date(
      userVerificationDetails[0].createdAt,
    ).getTime();

    if (code !== userVerificationDetails[0].code) {
      throw new BadRequestException('invalid verification code');
    }
    if (verificationCase !== userVerificationDetails[0].verificationCase) {
      throw new BadRequestException('invalid verification case');
    }
    if (verificationType !== userVerificationDetails[0].verificationType) {
      throw new BadRequestException('invalid verification type');
    }
    if (now - codeCreatedAt > 900000) {
      await this.userVerifyRepo.remove(userVerificationDetails[0]);
      throw new BadRequestException('verification code expired');
    }

    let verifiedUser;
    if (verificationCase === VerificationCase.REGISTER) {
      if (verificationType === VerificationType.EMAIL) {
        verifiedUser = await this.usersService.updateUser({
          id: tokenPayload.userId,
          isVerifiedEmail: true,
        });
      }
      if (verificationType === VerificationType.MOBILE) {
        verifiedUser = await this.usersService.updateUser({
          id: tokenPayload.userId,
          isVerifiedMobile: true,
        });
      }
    }

    const userOperationDetails = await this.registerUserOperationsDetails(
      verifiedUser,
      headersData,
      Operations.REGISTER,
      TokenType.LOGIN,
      DeviceType.DESKTOP,
    );
    return userOperationDetails;
  }

  private async registerUserOperationsDetails(
    userData: User,
    data,
    operation: Operations,
    tokenType: TokenType,
    device: DeviceType,
  ) {
    let tokenPayload;
    const deviceIP = data['x-forwarded-for'];
    const userAgent = data['user-agent'];

    if (userData.email) {
      tokenPayload = {
        userId: userData.id,
        email: userData.email,
      };
    }
    if (userData.mobile) {
      tokenPayload = {
        userId: userData.id,
        mobile: userData.mobile,
      };
    }
    const token = this.generateToken(tokenPayload);
    const operationsDetailsEntity = this.userOperationsRepo.create({
      device,
      deviceIP,
      operation,
      token,
      user: userData,
      tokenType,
      userAgent,
    });
    return await this.userOperationsRepo.save(operationsDetailsEntity);
  }

  private generateToken(payload) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get('PRIVATE_KEY'),
      algorithm: 'RS256',
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      issuer: this.configService.get('ISSUER'),
      audience: this.configService.get('AUDIENCE'),
      mutatePayload: false,
    });
  }

  async verifyToken(token: string) {
    const res = await this.jwtService.verify(token, {
      algorithms: ['RS256'],
      publicKey: this.configService.get('PUBLIC_KEY'),
    });
    return res;
  }
}
