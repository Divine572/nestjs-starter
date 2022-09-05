import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegistrationDto } from './dto/registration.dto';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from '../database/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registrationData: RegistrationDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
    if (!isCorrectPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
