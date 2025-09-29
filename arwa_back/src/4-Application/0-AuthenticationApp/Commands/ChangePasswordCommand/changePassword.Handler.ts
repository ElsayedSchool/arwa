import { UserRepo } from "src/3-Infrastructure/Repositories";
import { ChangePasswordCommand } from "./changePassword.Command";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { Injectable } from "@nestjs/common";
import { JWTToken } from "src/3-Infrastructure/Authentication/AuthModels/token.model";

@Injectable()
export class ChangePasswordHandler {
  constructor(
    private readonly userrepo: UserRepo,
    private hashSer: BcryptService
  ) {}

  async handle(
    command: ChangePasswordCommand,
    userToken: JWTToken
  ): Promise<boolean> {
    // get user by id
    const user = await this.userrepo.findByIdAsync(userToken.id);
    // update password
    const hashedPassword = await this.hashSer.getHashedPassword(
      command.newPassword
    );
    user.password = hashedPassword;
    // return response
    await this.userrepo.saveAsync(user);
    return true;
  }
}
