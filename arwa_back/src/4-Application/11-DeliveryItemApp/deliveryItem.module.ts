import { Module } from "@nestjs/common";
import { DeliveryItemController } from "./deliveryItem.controller";
import { GetAllDeliveryItemHandler } from "./Queries/getAllDeliveryItem.Handler";
import { GetByIdDeliveryItemHandler } from "./Queries/getByIdDeliveryItem.Handler";
import { UpsertDeliveryItemHandler } from "./Commands/upsertDeliveryItem.Handler";
import { DeleteDeliveryItemHandler } from "./Commands/deleteDeliveryItem.Handler";

@Module({
  controllers: [DeliveryItemController],
  providers: [
    GetAllDeliveryItemHandler,
    GetByIdDeliveryItemHandler,
    UpsertDeliveryItemHandler,
    DeleteDeliveryItemHandler,
  ],
  exports: [
    GetAllDeliveryItemHandler,
    GetByIdDeliveryItemHandler,
    UpsertDeliveryItemHandler,
    DeleteDeliveryItemHandler,
  ],
})
export class DeliveryItemModule {}
