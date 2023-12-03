import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
  UserTokensDetails,
} from '../entities/user-tokens-details';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Mail } from 'src/shared/services/mail/mail';
import { matchedPassword } from 'src/shared/libs/compare-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserVerification)
    private readonly userVerifyRepo: Repository<UserVerification>,
    @InjectRepository(UserTokensDetails)
    private readonly userOperationsRepo: Repository<UserTokensDetails>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: Mail,
  ) {}

  async login(data: LoginDTO, operationHeaders) {
    const { email, password } = data;
    const user = await this.usersService.findUser({ email });
    if (!user) {
      throw new UnauthorizedException('email or password is incorrect');
    }
    const isPasswordCorrect = await matchedPassword(user.password, password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('email or password is incorrect');
    }
    const userToken = await this.registerUserTokensDetails(
      user,
      operationHeaders,
      Operations.LOGIN_IN,
      TokenType.LOGIN,
      data.device,
    );
    return userToken;
  }

  async register(data: RegisterDTO, operationHeaders) {
    const user = await this.usersService.createUser(data);
    const operationResult = await this.registerUserTokensDetails(
      user,
      operationHeaders,
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
    const tokenPayload = await this.verifyToken(jwtToken);
    const userTokens = await this.userOperationsRepo.findBy({
      userId: tokenPayload.userId,
    });
    const user = await this.usersService.findUser({ id: tokenPayload.userId });
    if (!userTokens && !userTokens.length) {
      throw new NotFoundException('user token not found');
    }
    if (!user) {
      throw new NotFoundException('user assigned to this token not found');
    }
    if (
      verificationCase === VerificationCase.REGISTER &&
      user.isVerifiedEmail
    ) {
      throw new ForbiddenException('user is already verified');
    }
    // if (
    //   (tokenPayload.email && verificationType === VerificationType.MOBILE) ||
    //   (tokenPayload.mobile && verificationType === VerificationType.EMAIL)
    // ) {
    //   throw new ForbiddenException(
    //     'invalid verification case or verification type',
    //   );
    // }
    if (
      verificationCase === VerificationCase.REGISTER &&
      (userTokens.length !== 1 || userTokens[0].operation !== 'REGISTER')
    ) {
      throw new ForbiddenException(
        'Some thing is wrong with the verification process',
      );
    }

    if (user.email) {
      const code = Math.floor(100000 + Math.random() * 900000).toFixed(0);
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
        to: user.email,
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
    device: DeviceType,
  ) {
    const jwtToken = headersData['authorization'].split(' ')[1];
    const tokenPayload = await this.verifyToken(jwtToken);
    const userVerificationDetails = await this.userVerifyRepo.find({
      where: {
        userId: tokenPayload.userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const user = await this.usersService.findUser({ id: tokenPayload.userId });

    if (
      user.isVerifiedEmail &&
      verificationCase === VerificationCase.REGISTER
    ) {
      throw new ForbiddenException('user is already verified');
    }
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
      // if (verificationType === VerificationType.MOBILE) {
      //   verifiedUser = await this.usersService.updateUser({
      //     id: tokenPayload.userId,
      //     isVerifiedMobile: true,
      //   });
      // }
    }

    const operation =
      verificationCase === VerificationCase.REGISTER
        ? Operations.REGISTER
        : Operations.LOGIN_IN;

    const userOperationDetails = await this.registerUserTokensDetails(
      verifiedUser,
      headersData,
      operation,
      TokenType.LOGIN,
      device,
    );
    return userOperationDetails;
  }

  private async registerUserTokensDetails(
    userData: User,
    data,
    operation: Operations,
    tokenType: TokenType,
    device: DeviceType,
  ) {
    // let tokenPayload;
    const deviceIP = data['x-forwarded-for'];
    const userAgent = data['user-agent'];

    const tokenPayload = {
      userId: userData.id,
    };
    // if (userData.email) {
    // }
    // if (userData.mobile) {
    //   tokenPayload = {
    //     userId: userData.id,
    //     mobile: userData.mobile,
    //   };
    // }
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
    });
  }

  async verifyToken(token: string) {
    try {
      const res = await this.jwtService.verify(token, {
        algorithms: ['RS256'],
        publicKey: this.configService.get('PUBLIC_KEY'),
      });
      return res;
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
