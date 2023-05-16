import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { MailerService } from 'src/mailer/mailer.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailerService: MailerService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    return user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const user = await this.authService.getUserByEmail(body.email);

    if (!user) {
      return { status: 404, content: { msg: 'User not found' } };
    }

    const token = await this.authService.generateResetPasswordToken(user);
    console.log(token);

    await this.mailerService.sendResetPasswordEmail(user.email, token);

    return { status: 200, content: { msg: 'Reset password email sent' } };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: { password: string },
  ) {
    const resetPasswordResult = await this.authService.resetPassword(
      token,
      body.password,
    );
    return {
      status: resetPasswordResult.status,
      content: resetPasswordResult.msg,
    };
  }
}
