import { Injectable } from "@nestjs/common";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdDeliveryQuery } from "./getByIdDelivery.Query";

@Injectable()
export class GetByIdDeliveryHandler {
  constructor(private repo: DeliveryRepo) {}
  async handle(q: GetByIdDeliveryQuery) {
    const delivery = await this.repo.findOneActive({
      where: { id: q.id },
      relations: ["deliveryItems", "deliveryItems.type"],
    });

    if (!delivery) return null;

    // Transform to DeliveryUi format
    return {
      id: delivery.id,
      supplierName: delivery.supplierName,
      driverName: delivery.driverName,
      deliveryDate: delivery.deliveryDate.toISOString().split("T")[0],
      deliveryTime: delivery.deliveryDate
        .toISOString()
        .split("T")[1]
        .substring(0, 5),
      lastEditTime: delivery.lastUpdated?.toISOString() || null,
      totalWeight:
        delivery.deliveryItems?.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        ) || 0,
      paymentStatus:
        delivery.totalDue === 0
          ? "paid"
          : delivery.totalPaid > 0
            ? "partial"
            : "unpaid",
      totalCost: delivery.totalPrice,
      amountPaid: delivery.totalPaid,
      remainingAmount: delivery.totalDue,
      fishTypes:
        delivery.deliveryItems?.map((item) => ({
          type: item.type?.name || "",
          weight: Number(item.amount),
          pricePerKg: 0, // Default price
        })) || [],
    };
  }
}
