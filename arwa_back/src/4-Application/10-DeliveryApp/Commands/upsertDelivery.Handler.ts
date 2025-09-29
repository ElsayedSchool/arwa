import { UpsertDeliveryCommand } from "./upsertDelivery.Command";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";
import { CategoryRepo } from "src/3-Infrastructure/Repositories";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";
import { DeliveryItem } from "src/2-Domain/Entities";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpsertDeliveryHandler {
  constructor(
    private repo: DeliveryRepo,
    private categoryRepo: CategoryRepo,
    private deliveryItemRepo: DeliveryItemRepo
  ) {}
  async execute(cmd: UpsertDeliveryCommand) {
    const payload = cmd.payload;

    // Transform the payload from frontend format to database format
    const dateTimeString =
      payload.deliveryDate +
      "T" +
      (payload.deliveryTime.length === 5
        ? payload.deliveryTime + ":00"
        : payload.deliveryTime);
    const deliveryDate = new Date(dateTimeString);
    if (isNaN(deliveryDate.getTime())) {
      throw new Error("Invalid delivery date/time");
    }
    const transformedPayload = {
      supplierId: payload.supplierId,
      supplierName: payload.supplierName,
      driverName: payload.driverName,
      deliveryDate,
      totalPrice: payload.totalCost || 0,
      totalPaid: payload.amountPaid || 0,
      totalDue: payload.remainingAmount || 0,
    };

    // Create delivery first
    const delivery = await this.repo.saveAsync(transformedPayload);

    // Create delivery items
    if (payload.fishTypes && Array.isArray(payload.fishTypes)) {
      const deliveryItems: Partial<DeliveryItem>[] = [];

      for (const fishType of payload.fishTypes) {
        // Find category by name
        const categories = await this.categoryRepo.findAllAsync({
          where: { name: fishType.type, isDeleted: false },
        });

        if (categories.length > 0) {
          deliveryItems.push({
            deliveryId: delivery.id,
            typeId: categories[0].id.toString(),
            amount: fishType.weight || fishType.quantity || 0,
            classification: fishType.unit || "kg",
          });
        }
      }

      // Save delivery items
      if (deliveryItems.length > 0) {
        await this.deliveryItemRepo.saveManyAsync(deliveryItems);
      }
    }

    // Reload delivery with relations for proper response
    const savedDelivery = await this.repo.findOneActive({
      where: { id: delivery.id },
      relations: ["deliveryItems", "deliveryItems.type"],
    });

    if (!savedDelivery) return delivery;

    // Transform to DeliveryUi format
    return {
      id: savedDelivery.id,
      supplierName: savedDelivery.supplierName,
      driverName: savedDelivery.driverName,
      deliveryDate: savedDelivery.deliveryDate.toISOString().split("T")[0],
      deliveryTime: savedDelivery.deliveryDate
        .toISOString()
        .split("T")[1]
        .substring(0, 5),
      lastEditTime: savedDelivery.lastUpdated?.toISOString() || null,
      totalWeight:
        savedDelivery.deliveryItems?.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        ) || 0,
      paymentStatus:
        savedDelivery.totalDue === 0
          ? "paid"
          : savedDelivery.totalPaid > 0
            ? "partial"
            : "unpaid",
      totalCost: savedDelivery.totalPrice,
      amountPaid: savedDelivery.totalPaid,
      remainingAmount: savedDelivery.totalDue,
      fishTypes:
        savedDelivery.deliveryItems?.map((item) => ({
          type: item.type?.name || "",
          weight: Number(item.amount),
          pricePerKg: 0, // Default price
        })) || [],
    };
  }
}
