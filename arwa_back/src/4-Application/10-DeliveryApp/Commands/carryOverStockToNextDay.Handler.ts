import { Injectable } from "@nestjs/common";
import { CarryOverStockToNextDayCommand } from "./carryOverStockToNextDay.Command";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";
import { DeliveryItem } from "src/2-Domain/Entities";
import { Between } from "typeorm";

@Injectable()
export class CarryOverStockToNextDayHandler {
  constructor(
    private deliveryRepo: DeliveryRepo,
    private deliveryItemRepo: DeliveryItemRepo,
    private supplierRepo: SupplierRepo
  ) {}

  async execute(cmd: CarryOverStockToNextDayCommand) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // Fetch deliveries for today
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const deliveries = await this.deliveryRepo.findAllAsync({
      where: {
        deliveryDate: Between(startOfDay, endOfDay),
        isDeleted: false,
      },
      relations: ["deliveryItems"],
    });

    // Aggregate remaining stock by fishTypeId
    const stockMap = new Map<number, { totalStock: number; items: any[] }>();

    for (const delivery of deliveries) {
      for (const item of delivery.deliveryItems || []) {
        if (item.stock > 0) {
          const fishTypeId = item.fishTypeId;
          if (!stockMap.has(fishTypeId)) {
            stockMap.set(fishTypeId, { totalStock: 0, items: [] });
          }
          const entry = stockMap.get(fishTypeId)!;
          entry.totalStock += Number(item.stock);
          entry.items.push(item);
        }
      }
    }

    // Find stock supplier
    const stockSupplier = await this.supplierRepo.findOneActive({
      where: { isStock: true },
    });

    if (!stockSupplier) {
      throw new Error("Stock supplier not found");
    }

    // Create new delivery for tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newDelivery = await this.deliveryRepo.saveAsync({
      supplierId: stockSupplier.id,
      supplierName: stockSupplier.name,
      deliveryDate: tomorrow,
      totalDeliveryPrice: 0,
      totalDebt: 0,
      totalPaidDelivery: 0,
      discount: 0,
      updatedDebt: 0,
      soldAmount: 0,
      totalSoldPrice: 0,
    });

    // Create aggregated delivery items
    const deliveryItems: Partial<DeliveryItem>[] = [];

    for (const [fishTypeId, { totalStock, items }] of stockMap) {
      deliveryItems.push({
        deliveryId: newDelivery.id,
        fishTypeId,
        fishTypeName: items[0].fishTypeName || "",
        amount: totalStock,
        pricePerKilo: 0,
        totalPrice: 0,
        soldAmount: 0,
        restAmount: 0,
        stock: 0,
      });
    }

    if (deliveryItems.length > 0) {
      await this.deliveryItemRepo.saveManyAsync(deliveryItems);
    }

    // Reload delivery with items
    const savedDelivery = await this.deliveryRepo.findOneActive({
      where: { id: newDelivery.id },
      relations: ["deliveryItems", "deliveryItems.type"],
    });

    return savedDelivery;
  }
}
