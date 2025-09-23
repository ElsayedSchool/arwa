import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { AuthService } from '../../auth.service';
import { ForgetPasswordCommand } from './forgetPassword.Command';
import { MailService } from 'src/3-Infrastructure/MailApi/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ForgetPasswordHandler {
  constructor(
    private userRepo: UserRepo,
    private authSer: AuthService,
    private mailSer: MailService,
    private configSer: ConfigService,
  ) {}
  async handle(command: ForgetPasswordCommand) {
    const { email } = command;

    // get user by email,iscredential
    const userData = await this.userRepo.getUserByEmailForCredentials(email);

    // generate token with expiration after 1 hr
    if (userData) {
      const resetToken = await this.authSer.getResetPasswordToken(userData);

      // get front url
      const url = `${this.configSer.get(
        'BASE_URL',
      )}/changepassword/${resetToken}`;
      // send token to email
      await this.mailSer.sendResetEmail(userData.email, 'Reset Password', url);
    }

    return true;
    // return check your email
  }
}
