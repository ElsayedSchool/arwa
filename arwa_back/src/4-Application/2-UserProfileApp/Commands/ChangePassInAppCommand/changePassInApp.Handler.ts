import { UserRepo } from 'src/3-Infrastructure/Repositories/Repositories/user.repository';
import { BcryptService } from 'src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChangePassInAppCommand } from './changePassInApp.Command';
import { JWTToken } from 'src/3-Infrastructure/Authentication/AuthModels/token.model';

@Injectable()
export class ChangePassInAppHandler {
  constructor(
    private readonly userRepo: UserRepo,
    private hashSer: BcryptService,
  ) {}

  async handle(command: ChangePassInAppCommand, user: JWTToken) {
    // get user by id
    const userData = await this.userRepo.findByIdAsync(user.id);
    // check old password
    const isOldPasswordValid = await this.hashSer.isPasswordValid(
      command.oldPassword,
      userData.password,
    );
    if (!isOldPasswordValid)
      throw new BadRequestException('كلمه المرور غير صحيحه');
    // update password
    const hashedPassword = await this.hashSer.getHashedPassword(
      command.newPassword,
    );
    userData.password = hashedPassword;
    // return response
    return await this.userRepo.saveAsync(userData);
  }
}
