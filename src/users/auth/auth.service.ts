import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(data: LoginDto) {
    const { email, password } = data;
    console.log(data);
  }

  async register(data: RegisterDto) {
    const user = this.usersService.createUser(data);
    return user;
  }
}
