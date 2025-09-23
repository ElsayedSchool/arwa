import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { Injectable } from '@nestjs/common';
import { RemoveUserCommand } from './removeUser.Command';
import { AuthService } from 'src/4-Application/0-AuthenticationApp/auth.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/3-Infrastructure/MailApi/mail.service';

@Injectable()
export class RemoveUserHandler {
  constructor(
    private userRepo: UserRepo,
    private authSer: AuthService,
    private configSer: ConfigService,
    private mailSer: MailService,
  ) {}
  async handle(command: RemoveUserCommand) {
    const userData = await this.userRepo.getUserByEmail(command.email);
    if (userData) {
      const resetToken = await this.authSer.getResetPasswordToken(userData);

      // get front url
      const url = `${this.configSer.get(
        'BASE_URL',
      )}/confirmremove/${resetToken}`;
      // send token to email
      await this.mailSer.sendRemoveAccountByEmail(
        userData.email,
        'confirm Remove Account',
        url,
      );
    }
    return true;
  }
}
