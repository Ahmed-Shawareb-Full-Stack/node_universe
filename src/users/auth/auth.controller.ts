import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { UserVerificationDTO } from './dto/user-verification.dto';
import { VerifyUserDTO } from './dto/verify-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  @Post('send-user-verification')
  sendUserVerification(
    @Body() data: UserVerificationDTO,
    @Headers('authorization') token: string,
  ) {
    return this.authService.sendUserVerification(
      data.verificationCase,
      data.verificationType,
      token,
    );
  }

  @Post('register')
  register(@Body() data: RegisterDTO, @Headers() headers) {
    return this.authService.register(data, headers);
  }

  @Post('verify-user')
  verifyUser(@Body() data: VerifyUserDTO, @Headers() headers: string) {
    return this.authService.verifyUser(
      data.code,
      headers,
      data.verificationCase,
      data.verificationType,
    );
  }

  @Post('change-password')
  changePassword(@Body() data: ChangePasswordDTO) {
    return this.authService.changePassword(data);
  }
}
