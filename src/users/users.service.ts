import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from './auth/dto/register.dto';
import { hashPassword } from 'src/shared/libs/hash-password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(data: RegisterDTO) {
    const { password } = data;
    const hashedPassword = await hashPassword(password);
    const userEntity = this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    const user = await this.userRepo.save(userEntity);
    return user;
  }

  async findUser(data: Partial<User>) {
    const { id, email, mobile } = data;
    const user = id
      ? await this.userRepo.findOneBy({ id })
      : email
        ? await this.userRepo.findOneBy({ email })
        : mobile
          ? await this.userRepo.findOneBy({ mobile })
          : null;

    return user;
  }

  async updateUser(data: Partial<User>) {
    const updatedUser = await this.userRepo.preload(data);
    return await this.userRepo.save(updatedUser);
  }
}
