import { UserRepo } from "src/3-Infrastructure/Repositories";
import { DeactivateEmployeeCommand } from "./deactivateEmployee.Command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeactivateEmployeeHandler {
  constructor(private userRepo: UserRepo) {}

  async handle(command: DeactivateEmployeeCommand): Promise<boolean> {
    const user = await this.userRepo.findByIdAsync(command.id);
    user.isActive = command.isActive;
    await this.userRepo.saveAsync(user);
    return true;
  }
}
