import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { GetAllCustomersQueryHandler } from "./Queries/GetAllCustomersQuery/getAllCustomers.Handler";
import { GetCustomerByIdQueryHandler } from "./Queries/GetCustomerByIdQuery/getCustomerById.Handler";
import { GetCustomerOrdersQueryHandler } from "./Queries/GetCustomerOrdersQuery/getCustomerOrders.Handler";
import { UpsertCustomerCommandHandler } from "./Commands/UpsertCustomerCommand/upsertCustomer.Handler";
import { DeleteCustomerCommandHandler } from "./Commands/DeleteCustomerCommand/deleteCustomer.Handler";

@Module({
  controllers: [CustomerController],
  providers: [
    GetAllCustomersQueryHandler,
    GetCustomerByIdQueryHandler,
    GetCustomerOrdersQueryHandler,
    UpsertCustomerCommandHandler,
    DeleteCustomerCommandHandler,
  ],
})
export class CustomerModule {}
