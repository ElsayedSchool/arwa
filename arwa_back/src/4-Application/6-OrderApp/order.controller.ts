import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  Query,
} from "@nestjs/common";
import { GetAllOrderHandler } from "./Queries/getAllOrder.Handler";
import { GetAllOrderQuery } from "./Queries/getAllOrder.Query";
import { GetByIdOrderHandler } from "./Queries/getByIdOrder.Handler";
import { UpsertOrderHandler } from "./Commands/upsertOrder.Handler";
import { DeleteOrderHandler } from "./Commands/deleteOrder.Handler";
import {
  UpsertOrderCommand,
  UpsertOrderDto,
} from "./Commands/upsertOrder.Command";
import { DeleteOrderCommand } from "./Commands/deleteOrder.Command";
import { CreateOrderListHandler } from "./Commands/createOrderList.Handler";
import { CreateOrderListCommand } from "./Commands/createOrderList.Command";
import { UpdateOrderItemsHandler } from "./Commands/updateOrderItems.Handler";
import {
  UpdateOrderItemsCommand,
  UpdateOrderItemsDto,
} from "./Commands/updateOrderItems.Command";

@Controller("order")
export class OrderController {
  constructor(
    private readonly getAll: GetAllOrderHandler,
    private readonly getById: GetByIdOrderHandler,
    private readonly upsert: UpsertOrderHandler,
    private readonly updateItems: UpdateOrderItemsHandler,
    private readonly del: DeleteOrderHandler,
    private readonly createList: CreateOrderListHandler
  ) {}

  @Get()
  async all(
    @Query("dateFilter") dateFilter?: string,
    @Query("dateFrom") dateFrom?: string,
    @Query("dateTo") dateTo?: string
  ) {
    return this.getAll.handle(
      new GetAllOrderQuery(dateFilter, dateFrom, dateTo)
    );
  }

  @Get(":id")
  async one(@Param("id") id: string) {
    return this.getById.handle({ id });
  }

  @Post()
  async upsertOne(@Body() body: UpsertOrderDto) {
    return this.upsert.execute(new UpsertOrderCommand(body));
  }

  @Put(":id")
  async updateOne(@Param("id") id: string, @Body() body: UpdateOrderItemsDto) {
    // Ensure the ID from the URL parameter is used
    body.id = id;
    return this.updateItems.execute(new UpdateOrderItemsCommand(body));
  }

  @Post("create-list")
  async createOrderList() {
    return this.createList.execute(new CreateOrderListCommand());
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteOrderCommand(id));
  }
}
