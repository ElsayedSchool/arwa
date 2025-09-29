import { Module } from "@nestjs/common";
import { DeliveryController } from "./delivery.controller";
import { GetAllDeliveryHandler } from "./Queries/getAllDelivery.Handler";
import { GetByIdDeliveryHandler } from "./Queries/getByIdDelivery.Handler";
import { UpsertDeliveryHandler } from "./Commands/upsertDelivery.Handler";
import { DeleteDeliveryHandler } from "./Commands/deleteDelivery.Handler";

@Module({
  controllers: [DeliveryController],
  providers: [
    GetAllDeliveryHandler,
    GetByIdDeliveryHandler,
    UpsertDeliveryHandler,
    DeleteDeliveryHandler,
  ],
  exports: [
    GetAllDeliveryHandler,
    GetByIdDeliveryHandler,
    UpsertDeliveryHandler,
    DeleteDeliveryHandler,
  ],
})
export class DeliveryModule {}
