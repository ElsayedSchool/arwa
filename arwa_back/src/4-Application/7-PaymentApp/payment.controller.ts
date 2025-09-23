import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllPaymentHandler } from "./Queries/getAllPayment.Handler";
import { GetByIdPaymentHandler } from "./Queries/getByIdPayment.Handler";
import { UpsertPaymentHandler } from "./Commands/upsertPayment.Handler";
import { DeletePaymentHandler } from "./Commands/deletePayment.Handler";
import { UpsertPaymentCommand } from "./Commands/upsertPayment.Command";
import { DeletePaymentCommand } from "./Commands/deletePayment.Command";

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly getAll: GetAllPaymentHandler,
    private readonly getById: GetByIdPaymentHandler,
    private readonly upsert: UpsertPaymentHandler,
    private readonly del: DeletePaymentHandler
  ) {}

  @Get()
  async all() {
    return this.getAll.handle();
  }

  @Get(":id")
  async one(@Param("id") id: string) {
    return this.getById.handle({ id });
  }

  @Post()
  async upsertOne(@Body() body: any) {
    return this.upsert.execute(new UpsertPaymentCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeletePaymentCommand(id));
  }
}
