import { Injectable } from "@nestjs/common";
import { DeleteCustomerCommand } from "./deleteCustomer.Command";
import { CustomerRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class DeleteCustomerCommandHandler {
  constructor(private customerRepo: CustomerRepo) {}

  async handle(command: DeleteCustomerCommand): Promise<boolean> {
    await this.customerRepo.softDelete(
      command.id,
      command.deletedById,
      command.deletedByName
    );
    return true;
  }
}
