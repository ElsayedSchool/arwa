import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { RevokeCodeCommand } from './revokeCode.Command';
import { MailService } from 'src/3-Infrastructure/MailApi/mail.service';
import { BcryptService } from 'src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service';
import { TimeService } from 'src/3-Infrastructure/timeService/time.service';

@Injectable()
export class RevokeCodeHandler {
  constructor(
    private userRepo: UserRepo,
    private mailSer: MailService,
    private bcrypt: BcryptService,
    private timeSer: TimeService,
  ) {}

  async handle(command: RevokeCodeCommand) {
    // get user by id
    const userData = await this.userRepo.findByIdAsync(command.userId);
    // check if user exists
    if (userData) {
      // generate random code
      const code = await this.bcrypt.getRandomCode();
      const hashedCode = await this.bcrypt.getHashedVerificationCode(code);

      // save updated code
      userData.verificationCode = hashedCode;
      userData.verificationCodeExpirationDate = this.timeSer.getDateAfterNow(
        0,
        0,
        15,
      );

      await this.userRepo.saveAsync(userData);

      // send email again
      await this.mailSer.sendMail(
        userData.email,
        'Email Verification For FEL Sport App',
        '',
        parseInt(code),
      );
    }
    return true;
  }
}
