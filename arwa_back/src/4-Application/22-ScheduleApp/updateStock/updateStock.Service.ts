import { Injectable, Inject } from "@nestjs/common";
import {
  DeliveryRepo,
  DeliveryItemRepo,
  SupplierRepo,
} from "src/3-Infrastructure/Repositories";
import { Delivery, DeliveryItem, Supplier } from "src/2-Domain";
import { Logger } from "winston";

@Injectable()
export class UpdateStockService {
  constructor(
    private deliveryRepo: DeliveryRepo,
    private deliveryItemRepo: DeliveryItemRepo,
    private supplierRepo: SupplierRepo,
    @Inject("Logger") private log: Logger
  ) {}

  async updateStockAtEndOfDay(): Promise<void> {
    try {
      this.log.info("Starting end-of-day stock update process");

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find the stock supplier
      const stockSupplier = await this.supplierRepo.findAllAsync({
        where: { isStock: true },
      });

      if (!stockSupplier || stockSupplier.length === 0) {
        this.log.error(
          "Stock supplier not found. Please ensure seeding has been completed."
        );
        return;
      }

      // Get all deliveries from today
      const todaysDeliveries = await this.deliveryRepo.findAllAsync({
        where: {
          deliveryDate: {
            $gte: today,
            $lt: tomorrow,
          } as any,
        },
        relations: ["deliveryItems"],
      });

      if (!todaysDeliveries || todaysDeliveries.length === 0) {
        this.log.info("No deliveries found for today. Skipping stock update.");
        return;
      }

      // Aggregate rest amounts by fish type
      const aggregatedRest = new Map<
        number,
        { totalRest: number; pricePerKilo: number; fishTypeName: string }
      >();

      for (const delivery of todaysDeliveries) {
        for (const item of delivery.deliveryItems) {
          if (item.restAmount > 0) {
            const existing = aggregatedRest.get(item.fishTypeId) || {
              totalRest: 0,
              pricePerKilo: item.pricePerKilo,
              fishTypeName: item.fishTypeName,
            };

            existing.totalRest += item.restAmount;
            aggregatedRest.set(item.fishTypeId, existing);
          }
        }
      }

      if (aggregatedRest.size === 0) {
        this.log.info(
          "No remaining stock found from today's deliveries. Skipping stock delivery creation."
        );
        return;
      }

      // Create new delivery for stock supplier with tomorrow's date
      const stockDelivery = new Delivery();
      stockDelivery.supplierId = stockSupplier[0].id;
      stockDelivery.supplier = stockSupplier[0];
      stockDelivery.supplierName = stockSupplier[0].name;
      stockDelivery.isPayment = false;
      stockDelivery.driverName = "نظام المخزون التلقائي";
      stockDelivery.receivedByName = "نظام المخزون التلقائي";
      stockDelivery.totalDeliveryPrice = 0;
      stockDelivery.totalDebt = 0;
      stockDelivery.totalPaidDelivery = 0;
      stockDelivery.discount = 0;
      stockDelivery.updatedDebt = 0;
      stockDelivery.soldAmount = 0;
      stockDelivery.totalSoldPrice = 0;

      // Set delivery date to tomorrow
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      tomorrowDate.setHours(0, 0, 0, 0);
      stockDelivery.deliveryDate = tomorrowDate;

      const savedDelivery = await this.deliveryRepo.saveAsync(stockDelivery);

      // Create delivery items for the aggregated rest amounts
      const deliveryItems: DeliveryItem[] = [];
      let totalPrice = 0;

      for (const [fishTypeId, data] of aggregatedRest) {
        const deliveryItem = new DeliveryItem();
        deliveryItem.deliveryId = savedDelivery.id;
        deliveryItem.delivery = savedDelivery;
        deliveryItem.fishTypeId = fishTypeId;
        deliveryItem.fishTypeName = data.fishTypeName;
        deliveryItem.amount = data.totalRest;
        deliveryItem.pricePerKilo = data.pricePerKilo;
        deliveryItem.totalPrice = data.totalRest * data.pricePerKilo;
        deliveryItem.soldAmount = 0;
        deliveryItem.restAmount = data.totalRest;
        deliveryItem.stock = data.totalRest;

        deliveryItems.push(deliveryItem);
        totalPrice += deliveryItem.totalPrice;
      }

      await this.deliveryItemRepo.saveManyAsync(deliveryItems);

      // Update delivery totals
      savedDelivery.totalDeliveryPrice = totalPrice;
      await this.deliveryRepo.saveAsync(savedDelivery);

      this.log.info(
        `Stock delivery created successfully with ${deliveryItems.length} items and total value: ${totalPrice}`
      );
    } catch (error) {
      this.log.error("Error occurred during end-of-day stock update", error);
      throw error;
    }
  }
}
