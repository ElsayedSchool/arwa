import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllUsersHandler {
  constructor(private userRepo: UserRepo) {}
  async handle() {
    const users = await this.userRepo.getAllAdminUsers();
    if (!Array.isArray(users)) {
      throw new InternalServerErrorException("تعذر تحميل قائمة الموظفين");
    }
    return users;
  }
}
