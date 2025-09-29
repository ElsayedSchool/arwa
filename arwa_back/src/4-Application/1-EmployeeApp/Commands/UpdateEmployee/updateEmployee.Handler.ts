import { UserRepo } from "src/3-Infrastructure/Repositories";
import { UpdateEmployeeCommand } from "./updateEmployee.Command";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateEmployeeHandler {
  constructor(
    private userRepo: UserRepo,
    private authRepo: UserRepo
  ) {}

  async handle(command: UpdateEmployeeCommand) {
    const userData = await this.userRepo.getUserDetailById(command.id);
    if (!userData) throw new BadRequestException("No such user");
    if (command.email != userData.email) {
      const isEmailExist = await this.authRepo.isEmailExist(
        command.email.toLowerCase()
      );
      if (isEmailExist)
        throw new BadRequestException(
          "الحساب موجود بقاعده البيانات يمكنك تسجيل الدخول"
        );
    }
    userData.email = command.email;
    userData.roles = command.userRoles;
    userData.isActive = command.isActive;
    return await this.userRepo.saveAsync(userData);
  }
}
