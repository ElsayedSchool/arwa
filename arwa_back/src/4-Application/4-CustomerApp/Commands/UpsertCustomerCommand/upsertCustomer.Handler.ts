import { Injectable } from "@nestjs/common";
import { UpsertCustomerCommand } from "./upsertCustomer.Command";
import { Customer } from "src/2-Domain/Entities";
import { CustomerRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class UpsertCustomerCommandHandler {
  constructor(private customerRepo: CustomerRepo) {}

  async handle(command: UpsertCustomerCommand) {
    let customer: Customer;

    if (command.id && command.id.trim()) {
      // Update existing customer
      customer = await this.customerRepo.findOneActive({ where: { id: command.id } });
      if (!customer) {
        throw new Error(`Customer with id ${command.id} not found`);
      }

      // Update fields if provided
      if (command.name !== undefined && command.name !== null) customer.name = command.name;
      if (command.nickname !== undefined && command.nickname !== null) customer.nickname = command.nickname;
      if (command.phoneNumber !== undefined && command.phoneNumber !== null) customer.phoneNumber = command.phoneNumber;
    } else {
      // Create new customer
      customer = this.customerRepo.getRaw().create({
        name: command.name,
        nickname: command.nickname || undefined,
        phoneNumber: command.phoneNumber,
      });
    }

    const savedCustomer = await this.customerRepo.getRaw().save(customer);
    return savedCustomer;
  }
}
