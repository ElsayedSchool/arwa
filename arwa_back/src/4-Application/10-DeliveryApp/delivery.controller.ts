import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  Delete,
  Query,
} from "@nestjs/common";
import { GetAllDeliveryHandler } from "./Queries/getAllDelivery.Handler";
import { GetAllDeliveriesForStaffHandler } from "./Queries/getAllDeliveriesForStaff.Handler";
import { GetByIdDeliveryHandler } from "./Queries/getByIdDelivery.Handler";
import { UpsertDeliveryHandler } from "./Commands/upsertDelivery.Handler";
import { UpdateDeliveryItemRestAmountsHandler } from "./Commands/updateDeliveryItemRestAmounts.Handler";
import { DeleteDeliveryHandler } from "./Commands/deleteDelivery.Handler";
import { CreatePaymentDeliveryHandler } from "./Commands/createPaymentDelivery.Handler";
import { UpdatePaymentDeliveryHandler } from "./Commands/createPaymentDelivery.Handler";
import { UpsertDeliveryCommand } from "./Commands/upsertDelivery.Command";
import { UpdateDeliveryItemRestAmountsCommand } from "./Commands/updateDeliveryItemRestAmounts.Command";
import { DeleteDeliveryCommand } from "./Commands/deleteDelivery.Command";
import { CreatePaymentDeliveryCommand } from "./Commands/createPaymentDelivery.Command";
import { UpdatePaymentDeliveryCommand } from "./Commands/createPaymentDelivery.Command";

@Controller("delivery")
export class DeliveryController {
  constructor(
    private readonly getAll: GetAllDeliveryHandler,
    private readonly getAllForStaff: GetAllDeliveriesForStaffHandler,
    private readonly getById: GetByIdDeliveryHandler,
    private readonly upsert: UpsertDeliveryHandler,
    private readonly updateRestAmounts: UpdateDeliveryItemRestAmountsHandler,
    private readonly del: DeleteDeliveryHandler,
    private readonly createPayment: CreatePaymentDeliveryHandler,
    private readonly updatePayment: UpdatePaymentDeliveryHandler
  ) {}

  @Get()
  async all(@Query() q: any) {
    // pass through query parameters to handler for filtering
    return this.getAll.handle(q || {});
  }

  @Get("staff")
  async allForStaff(@Query() q: any) {
    // pass through query parameters to handler for filtering (without financial data)
    return this.getAllForStaff.handle(q || {});
  }

  @Get("inventory")
  async inventory(@Query() q: any) {
    // use staff handler for inventory (non-payment deliveries without financial data)
    return this.getAllForStaff.handle(q || {});
  }

  @Get(":id")
  async one(@Param("id") id: string) {
    return this.getById.handle({ id });
  }

  @Post()
  async upsertOne(@Body() body: any) {
    return this.upsert.execute(new UpsertDeliveryCommand(body));
  }

  @Post("payment")
  async createPaymentDelivery(
    @Body()
    body: {
      supplierId: string;
      supplierName: string;
      paidAmount: number;
      discount: number;
      driverName: string;
    }
  ) {
    return this.createPayment.execute(
      new CreatePaymentDeliveryCommand(
        body.supplierId,
        body.supplierName,
        body.paidAmount,
        body.discount,
        body.driverName
      )
    );
  }

  @Put("payment/:id")
  async updatePaymentDelivery(
    @Param("id") id: string,
    @Body()
    body: {
      supplierId: string;
      supplierName: string;
      paidAmount: number;
      discount: number;
      driverName: string;
    }
  ) {
    return this.updatePayment.execute(
      new UpdatePaymentDeliveryCommand(
        id,
        body.supplierId,
        body.supplierName,
        body.paidAmount,
        body.discount,
        body.driverName
      )
    );
  }

  @Put(":id/rest-amounts")
  async updateDeliveryItemRestAmounts(
    @Param("id") deliveryId: string,
    @Body()
    body: { itemUpdates: Array<{ deliveryItemId: string; restAmount: number }> }
  ) {
    return this.updateRestAmounts.execute(
      new UpdateDeliveryItemRestAmountsCommand(deliveryId, body.itemUpdates)
    );
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteDeliveryCommand(id));
  }
}
