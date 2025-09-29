import { UserRepo } from "src/3-Infrastructure/Repositories";
import { ChangeEmployeeRoleCommand } from "./changeEmployeeRole.Command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChangeEmployeeRoleHandler {
  constructor(private userRepo: UserRepo) {}
  async handle(command: ChangeEmployeeRoleCommand): Promise<boolean> {
    const user = await this.userRepo.findByIdAsync(command.id);
    user.isAdmin = command.isAdmin;
    user.roles = command.roles;
    return await this.userRepo.saveAsync(user);
  }
}
