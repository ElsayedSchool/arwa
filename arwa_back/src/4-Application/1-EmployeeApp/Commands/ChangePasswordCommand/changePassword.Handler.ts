import { UserRepo } from "src/3-Infrastructure/Repositories";
import { ChangePasswordCommand } from "./changePassword.Command";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ChangePasswordHandler {
  constructor(
    private readonly userrepo: UserRepo,
    private hashSer: BcryptService
  ) {}

  async handle(command: ChangePasswordCommand): Promise<boolean> {
    // get user by id
    const user = await this.userrepo.findByIdAsync(command.id);

    const hashedPassword = await this.hashSer.getHashedPassword(
      command.newPassword
    );
    user.password = hashedPassword;
    // return response
    await this.userrepo.saveAsync(user);
    return true;
  }
}
