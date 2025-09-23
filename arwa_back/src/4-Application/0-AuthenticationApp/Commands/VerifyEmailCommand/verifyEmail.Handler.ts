import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { VerifyEmailCommand } from './verifyEmail.Command';
import { MailService } from 'src/3-Infrastructure/MailApi/mail.service';
import { BcryptService } from 'src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service';
import { TranslateService } from 'src/3-Infrastructure/Translation/translation.service';

@Injectable()
export class VerifyEmailHandler {
  constructor(
    private userRepo: UserRepo,
    private mailSer: MailService,
    private bcrypt: BcryptService,
    private transSer: TranslateService,
  ) {}

  async handle(command: VerifyEmailCommand) {
    // get user by id
    const userData = await this.userRepo.findByIdAsync(command.userId);
    if (userData && userData.verificationCode) {
      const isCodeValid = await this.bcrypt.isCodeValid(
        command.code,
        userData.verificationCode,
      );
      // check if code is expired
      if (
        new Date().getTime() >
          new Date(userData.verificationCodeExpirationDate).getTime() ||
        !(await this.bcrypt.isCodeValid(
          command.code,
          userData.verificationCode,
        ))
      )
        throw new BadRequestException(
          this.transSer.trans('t.wrong_verification_code'),
        );

      // check if code is correct
      userData.emailConfirmed = true;
      userData.verificationCode = null;
      userData.verificationCodeExpirationDate = null;
      return { isVerified: await this.userRepo.saveAsync(userData) };
    }
    return { isVerified: true };
  }
}
