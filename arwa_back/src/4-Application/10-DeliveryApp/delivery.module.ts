import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { GetAllDeliveryHandler } from "./Queries/getAllDelivery.Handler";
import { GetAllDeliveriesForStaffHandler } from "./Queries/getAllDeliveriesForStaff.Handler";
import { GetByIdDeliveryHandler } from "./Queries/getByIdDelivery.Handler";
import { UpsertDeliveryHandler } from "./Commands/upsertDelivery.Handler";
import { UpdateDeliveryItemRestAmountsHandler } from "./Commands/updateDeliveryItemRestAmounts.Handler";
import { DeleteDeliveryHandler } from "./Commands/deleteDelivery.Handler";
import { CreatePaymentDeliveryHandler } from "./Commands/createPaymentDelivery.Handler";
import { UpdatePaymentDeliveryHandler } from "./Commands/createPaymentDelivery.Handler";
import { CarryOverStockToNextDayHandler } from "./Commands/carryOverStockToNextDay.Handler";
import { RepositoryModule } from "src/3-Infrastructure/Repositories/repository.module";

@Module({
  imports: [RepositoryModule],
  controllers: [DeliveryController],
  providers: [
    GetAllDeliveryHandler,
    GetAllDeliveriesForStaffHandler,
    GetByIdDeliveryHandler,
    UpsertDeliveryHandler,
    UpdateDeliveryItemRestAmountsHandler,
    DeleteDeliveryHandler,
    CreatePaymentDeliveryHandler,
    UpdatePaymentDeliveryHandler,
    CarryOverStockToNextDayHandler,
  ],
  exports: [
    GetAllDeliveryHandler,
    GetAllDeliveriesForStaffHandler,
    GetByIdDeliveryHandler,
    UpsertDeliveryHandler,
    UpdateDeliveryItemRestAmountsHandler,
    DeleteDeliveryHandler,
    CreatePaymentDeliveryHandler,
    UpdatePaymentDeliveryHandler,
    CarryOverStockToNextDayHandler,
  ],
})
export class DeliveryModule {}
