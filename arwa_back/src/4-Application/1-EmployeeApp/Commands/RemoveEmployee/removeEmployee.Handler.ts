import { UserRepo } from "src/3-Infrastructure/Repositories";
import { RemoveEmployeeCommand } from "./removeEmployee.Command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RemoveEmployeeHandler {
  constructor(private userRepo: UserRepo) {}
  async handle(command: RemoveEmployeeCommand): Promise<boolean> {
    return await this.userRepo.removeByIdAsync(command.id);
  }
}
