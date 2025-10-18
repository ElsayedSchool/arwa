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

  async carryOverStockToNextDay(): Promise<Delivery | null> {
    try {
      this.log.info("Starting carry over stock to next day process");

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find the stock supplier
      const stockSuppliers = await this.supplierRepo.findAllAsync({
        where: { isStock: true },
      });

      if (!stockSuppliers || stockSuppliers.length === 0) {
        this.log.error(
          "Stock supplier not found. Please ensure seeding has been completed."
        );
        return null;
      }

      const stockSupplier = stockSuppliers[0];

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
        this.log.info(
          "No deliveries found for today. Skipping stock carry over."
        );
        return null;
      }

      // Aggregate remaining stock by fish type
      const aggregatedStock = new Map<
        number,
        {
          fishTypeId: number;
          fishTypeName: string;
          totalStock: number;
          totalValue: number;
          averagePricePerKilo: number;
        }
      >();

      for (const delivery of todaysDeliveries) {
        for (const item of delivery.deliveryItems) {
          if (item.restAmount > 0) {
            const existing = aggregatedStock.get(item.fishTypeId) || {
              fishTypeId: item.fishTypeId,
              fishTypeName: item.fishTypeName,
              totalStock: 0,
              totalValue: 0,
              averagePricePerKilo: item.pricePerKilo,
            };

            existing.totalStock += item.restAmount;
            existing.totalValue += item.restAmount * item.pricePerKilo;

            // Calculate weighted average price
            if (existing.totalStock > 0) {
              existing.averagePricePerKilo =
                existing.totalValue / existing.totalStock;
            }

            aggregatedStock.set(item.fishTypeId, existing);
          }
        }
      }

      if (aggregatedStock.size === 0) {
        this.log.info(
          "No remaining stock found from today's deliveries. Skipping stock carry over."
        );
        return null;
      }

      // Create new delivery for tomorrow
      const newDelivery = new Delivery();
      newDelivery.supplierId = stockSupplier.id;
      newDelivery.supplier = stockSupplier;
      newDelivery.supplierName = stockSupplier.name;
      newDelivery.isPayment = false;
      newDelivery.driverName = "نظام المخزون التلقائي";
      newDelivery.receivedByName = "نظام المخزون التلقائي";
      newDelivery.totalDeliveryPrice = 0;
      newDelivery.totalDebt = 0;
      newDelivery.totalPaidDelivery = 0;
      newDelivery.discount = 0;
      newDelivery.updatedDebt = 0;
      newDelivery.soldAmount = 0;
      newDelivery.totalSoldPrice = 0;
      newDelivery.deliveryDate = tomorrow;

      const savedDelivery = await this.deliveryRepo.saveAsync(newDelivery);

      // Create aggregated delivery items
      const deliveryItems: DeliveryItem[] = [];
      let totalPrice = 0;

      for (const [fishTypeId, data] of aggregatedStock) {
        const deliveryItem = new DeliveryItem();
        deliveryItem.deliveryId = savedDelivery.id;
        deliveryItem.delivery = savedDelivery;
        deliveryItem.fishTypeId = fishTypeId;
        deliveryItem.fishTypeName = data.fishTypeName;
        deliveryItem.amount = data.totalStock;
        deliveryItem.pricePerKilo = data.averagePricePerKilo;
        deliveryItem.totalPrice = data.totalStock * data.averagePricePerKilo;
        deliveryItem.soldAmount = 0;
        deliveryItem.restAmount = data.totalStock;
        deliveryItem.stock = data.totalStock;

        deliveryItems.push(deliveryItem);
        totalPrice += deliveryItem.totalPrice;
      }

      await this.deliveryItemRepo.saveManyAsync(deliveryItems);

      // Update delivery totals
      savedDelivery.totalDeliveryPrice = totalPrice;
      await this.deliveryRepo.saveAsync(savedDelivery);

      // Fetch the complete delivery with items
      const completeDelivery = await this.deliveryRepo.findOneActive({
        where: { id: savedDelivery.id },
        relations: ["deliveryItems"],
      });

      this.log.info(
        `Stock carry over completed successfully with ${deliveryItems.length} items and total value: ${totalPrice}`
      );

      return completeDelivery;
    } catch (error) {
      this.log.error("Error occurred during stock carry over", error);
      throw error;
    }
  }
}
