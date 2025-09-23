import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
} from "@nestjs/common";
import { GetAllCustomersQueryHandler } from "./Queries/GetAllCustomersQuery/getAllCustomers.Handler";
import { GetCustomerByIdQueryHandler } from "./Queries/GetCustomerByIdQuery/getCustomerById.Handler";
import { GetCustomerOrdersQueryHandler } from "./Queries/GetCustomerOrdersQuery/getCustomerOrders.Handler";
import { GetCustomerOrdersQuery } from "./Queries/GetCustomerOrdersQuery/getCustomerOrders.Query";
import { UpsertCustomerCommand } from "./Commands/UpsertCustomerCommand/upsertCustomer.Command";
import { UpsertCustomerCommandHandler } from "./Commands/UpsertCustomerCommand/upsertCustomer.Handler";
import { DeleteCustomerCommand } from "./Commands/DeleteCustomerCommand/deleteCustomer.Command";
import { DeleteCustomerCommandHandler } from "./Commands/DeleteCustomerCommand/deleteCustomer.Handler";

@Controller("customers")
export class CustomerController {
  constructor(
    private getAll: GetAllCustomersQueryHandler,
    private getById: GetCustomerByIdQueryHandler,
    private getOrders: GetCustomerOrdersQueryHandler,
    private upsertHandler: UpsertCustomerCommandHandler,
    private deleteHandler: DeleteCustomerCommandHandler
  ) {}

  @Get()
  async getAllCustomers() {
    return await this.getAll.handle();
  }

  @Get(":id")
  async getCustomerById(@Param("id") id: string) {
    return await this.getById.handle({ id } as any);
  }

  @Get(":id/orders")
  async getCustomerOrders(
    @Param("id") id: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("exactDate") exactDate?: string
  ) {
    const query = new GetCustomerOrdersQuery({
      customerId: id,
      startDate,
      endDate,
      exactDate,
    });
    return await this.getOrders.handle(query);
  }

  @Post()
  async createCustomer(@Body() command: UpsertCustomerCommand) {
    return await this.upsertHandler.handle(command);
  }

  @Put()
  async updateCustomer(@Body() command: UpsertCustomerCommand) {
    return await this.upsertHandler.handle(command);
  }

  @Delete(":id")
  async deleteCustomer(
    @Param("id") id: string,
    @Body("deletedById") deletedById?: string,
    @Body("deletedByName") deletedByName?: string
  ) {
    const cmd = new DeleteCustomerCommand(id, deletedById, deletedByName);
    return await this.deleteHandler.handle(cmd);
  }
}
