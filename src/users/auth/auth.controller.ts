import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('send-user-verification')
  sendUserVerification(@Body() data) {}

  @Post('register')
  register(@Body() data: RegisterDto, @Headers() headers) {
    return this.authService.register(data, headers);
  }

  @Post('verify-user')
  verifyUser(@Body() data) {}

  @Post('change-password')
  changePassword(@Body() data: ChangePasswordDto) {
    return this.authService.changePassword(data);
  }
}
