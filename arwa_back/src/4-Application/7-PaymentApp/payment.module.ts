import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { GetAllPaymentHandler } from "./Queries/getAllPayment.Handler";
import { GetByIdPaymentHandler } from "./Queries/getByIdPayment.Handler";
import { UpsertPaymentHandler } from "./Commands/upsertPayment.Handler";
import { DeletePaymentHandler } from "./Commands/deletePayment.Handler";

@Module({
  controllers: [PaymentController],
  providers: [
    GetAllPaymentHandler,
    GetByIdPaymentHandler,
    UpsertPaymentHandler,
    DeletePaymentHandler,
  ],
  exports: [
    GetAllPaymentHandler,
    GetByIdPaymentHandler,
    UpsertPaymentHandler,
    DeletePaymentHandler,
  ],
})
export class PaymentModule {}
