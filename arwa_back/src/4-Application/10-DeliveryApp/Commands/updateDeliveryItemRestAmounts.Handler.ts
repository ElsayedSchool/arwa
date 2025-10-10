import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateDeliveryItemRestAmountsCommand } from "./updateDeliveryItemRestAmounts.Command";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class UpdateDeliveryItemRestAmountsHandler {
  constructor(
    private readonly deliveryRepo: DeliveryRepo,
    private readonly deliveryItemRepo: DeliveryItemRepo
  ) {}

  async execute(cmd: UpdateDeliveryItemRestAmountsCommand) {
    const { deliveryId, itemUpdates } = cmd;

    // Verify delivery exists
    const delivery = await this.deliveryRepo.findByIdAsync(deliveryId);
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${deliveryId} not found`);
    }

    // Update rest amounts for each delivery item
    const updatePromises = itemUpdates.map(async (update) => {
      const deliveryItem = await this.deliveryItemRepo.findByIdAsync(
        update.deliveryItemId
      );
      if (!deliveryItem) {
        throw new NotFoundException(
          `Delivery item with ID ${update.deliveryItemId} not found`
        );
      }

      // Verify the delivery item belongs to the specified delivery
      if (deliveryItem.deliveryId !== deliveryId) {
        throw new Error(
          `Delivery item ${update.deliveryItemId} does not belong to delivery ${deliveryId}`
        );
      }

      // Update the rest amount
      deliveryItem.restAmount = update.restAmount;
      return this.deliveryItemRepo.saveAsync(deliveryItem);
    });

    // Execute all updates
    await Promise.all(updatePromises);

    // Update delivery's last updated timestamp
    delivery.lastUpdated = new Date();
    await this.deliveryRepo.saveAsync(delivery);

    return {
      success: true,
      message: `Updated rest amounts for ${itemUpdates.length} delivery items`,
      deliveryId,
      updatedItems: itemUpdates.length,
    };
  }
}
