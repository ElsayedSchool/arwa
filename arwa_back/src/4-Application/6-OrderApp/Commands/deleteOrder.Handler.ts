import { Injectable } from "@nestjs/common";
import { DeleteOrderCommand } from "./deleteOrder.Command";
import { OrderRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class DeleteOrderHandler {
  constructor(private repo: OrderRepo) {}
  async execute(cmd: DeleteOrderCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
