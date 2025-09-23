import { Injectable } from "@nestjs/common";
import { Customer } from "src/2-Domain/Entities";
import { CustomerRepo } from "src/3-Infrastructure/Repositories";
import { GetCustomerByIdQuery } from "./getCustomerById.Query";

@Injectable()
export class GetCustomerByIdQueryHandler {
  constructor(private customerRepo: CustomerRepo) {}

  async handle(query: GetCustomerByIdQuery): Promise<Customer | null> {
    return await this.customerRepo
      .getRaw()
      .findOne({ where: { id: query.id } });
  }
}
