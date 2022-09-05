import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUserDto';
import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async getByEmail(email: string) {
    const user = await this.repo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async create(userData: UpdateUserDto) {
    const newUser = await this.repo.create(userData);
    await this.repo.save(newUser);
    return newUser;
  }
}
