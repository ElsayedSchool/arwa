import { UpsertExpenseCommand } from "./upsertExpense.Command";
import { ExpenseRepo } from "src/3-Infrastructure/Repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpsertExpenseHandler {
  constructor(private repo: ExpenseRepo) {}

  async execute(cmd: UpsertExpenseCommand) {
    return await this.repo.saveAsync(cmd.payload);
  }
}
