import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { GetAllExpensesHandler } from "./Queries/getAllExpenses.Handler";
import { UpsertExpenseHandler } from "./Commands/upsertExpense.Handler";
import { DeleteExpenseHandler } from "./Commands/deleteExpense.Handler";
import { UpsertExpenseCommand } from "./Commands/upsertExpense.Command";
import { DeleteExpenseCommand } from "./Commands/deleteExpense.Command";

@Controller("expense")
export class ExpenseController {
  constructor(
    private readonly getAll: GetAllExpensesHandler,
    private readonly upsert: UpsertExpenseHandler,
    private readonly del: DeleteExpenseHandler
  ) {}

  @Get()
  async all(@Query() q: any) {
    return this.getAll.handle(q || {});
  }

  @Post()
  async upsertOne(@Body() body: any) {
    return this.upsert.execute(new UpsertExpenseCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteExpenseCommand(id));
  }
}
