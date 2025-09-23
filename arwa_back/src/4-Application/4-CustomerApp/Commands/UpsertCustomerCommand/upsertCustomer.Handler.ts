import { Injectable } from "@nestjs/common";
import { UpsertCustomerCommand } from "./upsertCustomer.Command";
import { Customer } from "src/2-Domain/Entities";
import { CustomerRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class UpsertCustomerCommandHandler {
  constructor(private customerRepo: CustomerRepo) {}

  async handle(command: UpsertCustomerCommand) {
    const customer = this.customerRepo.getRaw().create({
      id: command.id,
      name: command.name,
      nickname: command.nickname,
      phoneNumber: command.phoneNumber,
    } as any);
    return await this.customerRepo.getRaw().save(customer);
  }
}
