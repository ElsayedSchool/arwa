import { Injectable } from "@nestjs/common";
import { GetStockOfDayQuery } from "./getStockOfDay.Query";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetStockOfDayHandler {
  constructor(
    private deliveryRepo: DeliveryRepo,
    private supplierRepo: SupplierRepo
  ) {}

  async handle(query: GetStockOfDayQuery) {
    const { targetDate } = query;

    // Calculate the next day
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find the stock supplier
    const stockSupplier = await this.supplierRepo.findOneActive({
      where: { isStock: true },
    });

    if (!stockSupplier) {
      return [];
    }

    // Find the delivery for the next day from the stock supplier
    const delivery = await this.deliveryRepo.findOneActive({
      where: {
        supplierId: stockSupplier.id,
        deliveryDate: nextDay,
      },
      relations: ["deliveryItems", "deliveryItems.type"],
    });

    if (!delivery || !delivery.deliveryItems) {
      return [];
    }

    // Return the delivery items
    return delivery.deliveryItems;
  }
}