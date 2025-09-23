import { Injectable } from "@nestjs/common";
import { Customer } from "src/2-Domain/Entities";
import { CustomerRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllCustomersQueryHandler {
  constructor(private customerRepo: CustomerRepo) {}

  async handle(): Promise<Customer[]> {
    return await this.customerRepo.findActive();
  }
}
