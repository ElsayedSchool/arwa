import { Module } from "@nestjs/common";
import { ExpenseController } from "./expense.controller";
import { GetAllExpensesHandler } from "./Queries/getAllExpenses.Handler";
import { UpsertExpenseHandler } from "./Commands/upsertExpense.Handler";
import { DeleteExpenseHandler } from "./Commands/deleteExpense.Handler";
import { RepositoryModule } from "src/3-Infrastructure/Repositories/repository.module";

@Module({
  imports: [RepositoryModule],
  controllers: [ExpenseController],
  providers: [
    GetAllExpensesHandler,
    UpsertExpenseHandler,
    DeleteExpenseHandler,
  ],
  exports: [GetAllExpensesHandler, UpsertExpenseHandler, DeleteExpenseHandler],
})
export class ExpenseModule {}
