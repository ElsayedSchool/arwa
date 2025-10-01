import { UpsertDeliveryItemCommand } from "./upsertDeliveryItem.Command";
import {
  DeliveryItemRepo,
  DeliveryRepo,
} from "src/3-Infrastructure/Repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpsertDeliveryItemHandler {
  constructor(
    private repo: DeliveryItemRepo,
    private deliveryRepo: DeliveryRepo
  ) {}
  async execute(cmd: UpsertDeliveryItemCommand) {
    // Save item with price fields if provided
    const saved = await this.repo.getRaw().save(cmd.payload);
    const deliveryId = (saved as any).deliveryId || cmd.payload.deliveryId;
    if (deliveryId) {
      // Recalculate delivery totals from items
      const items = await this.repo
        .getRaw()
        .find({ where: { deliveryId, isDeleted: false } as any });
      const total = items.reduce(
        (s, it: any) => s + Number(it.totalPrice || 0),
        0
      );
      // Update parent delivery totals, keeping paid the same
      const delivery = await this.deliveryRepo.findOneActive({
        where: { id: deliveryId },
      });
      const totalPaid = Number(delivery?.totalPaid || 0);
      await this.deliveryRepo.saveAsync({
        id: deliveryId,
        totalPrice: total,
        totalPaid,
        totalDue: Math.max(0, total - totalPaid),
      } as any);
    }
    return saved;
  }
}
