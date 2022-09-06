import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import JwtAuthGuard from './jwtAuth.guard';
import { LocalAuthGuard } from './localAuth.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegistrationDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const user = req.user;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    req.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return req.res.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    req.res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    return req.res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async me(@Req() req: RequestWithUser) {
    const user = req.user;
    user.password = undefined;
    return req.res.send(user);
  }
}
