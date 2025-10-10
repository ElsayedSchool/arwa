import { Not } from "typeorm";
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
      // Recalculate delivery totals after item update
      const delivery = await this.deliveryRepo.findOneActive({
        where: { id: deliveryId },
        relations: ["deliveryItems"],
      });

      if (delivery) {
        const totalDeliveryPrice =
          delivery.deliveryItems?.reduce(
            (sum, item) => sum + Number(item.totalPrice || 0),
            0
          ) || 0;

        const discount = Number(delivery.discount || 0);

        // Get the last delivery from the same supplier to get accumulated debt
        const lastSupplierDelivery = await this.deliveryRepo.findAllAsync({
          where: {
            supplierId: delivery.supplierId,
            isDeleted: false,
            id: Not(deliveryId), // Exclude current delivery
          },
          order: { deliveryDate: "DESC" },
          take: 1,
        });

        // totalDebt = updatedDebt from the last delivery of the same supplier
        const totalDebt =
          lastSupplierDelivery && lastSupplierDelivery.length > 0
            ? Number(lastSupplierDelivery[0].updatedDebt || 0)
            : 0;

        // Keep existing totalPaidDelivery unchanged
        const totalPaidDelivery = Number(delivery.totalPaidDelivery || 0);

        // updatedDebt = totalDebt + totalDeliveryPrice - totalPaidDelivery - discount
        const updatedDebt = Math.max(
          0,
          totalDebt + totalDeliveryPrice - totalPaidDelivery - discount
        );

        await this.deliveryRepo.saveAsync({
          id: deliveryId,
          totalDeliveryPrice,
          totalDebt,
          updatedDebt,
          // Keep existing totalPaidDelivery
        });
      }
    }
    return saved;
  }
}
