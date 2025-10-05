import { DeleteExpenseCommand } from "./deleteExpense.Command";
import { ExpenseRepo } from "src/3-Infrastructure/Repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteExpenseHandler {
  constructor(private repo: ExpenseRepo) {}

  async execute(cmd: DeleteExpenseCommand) {
    return await this.repo.softDelete(cmd.id);
  }
}
