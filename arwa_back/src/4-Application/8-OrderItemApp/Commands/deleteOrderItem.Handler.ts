import { Injectable } from "@nestjs/common";
import { DeleteOrderItemCommand } from "./deleteOrderItem.Command";
import { OrderItemRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class DeleteOrderItemHandler {
  constructor(private repo: OrderItemRepo) {}
  async execute(cmd: DeleteOrderItemCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
