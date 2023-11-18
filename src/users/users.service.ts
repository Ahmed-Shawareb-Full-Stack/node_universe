import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(data: RegisterDto) {
    const userEntity = this.userRepo.create(data);
    const user = await this.userRepo.save(userEntity);

    return user;
  }
  async findUser(data: Partial<User>) {
    const { id, email } = data;
    const user = id
      ? await this.userRepo.findOneBy({ id })
      : email
        ? await this.userRepo.findOneBy({ email })
        : null;

    return user;
  }
}
