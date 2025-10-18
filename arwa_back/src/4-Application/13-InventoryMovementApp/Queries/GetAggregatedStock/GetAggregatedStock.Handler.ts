import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Injectable, Inject } from "@nestjs/common";
import { GetAggregatedStockQuery } from "./GetAggregatedStock.Query";
import {
  DeliveryRepo,
  DeliveryItemRepo,
  SupplierRepo,
} from "src/3-Infrastructure/Repositories";
import { Logger } from "winston";

@Injectable()
@QueryHandler(GetAggregatedStockQuery)
export class GetAggregatedStockHandler {
  constructor(
    private deliveryRepo: DeliveryRepo,
    private deliveryItemRepo: DeliveryItemRepo,
    private supplierRepo: SupplierRepo,
    @Inject("Logger") private log: Logger
  ) {}

  async handle(query: GetAggregatedStockQuery): Promise<any> {
    try {
      this.log.info(
        "Getting aggregated stock for suppliers with isStock = true"
      );

      // Find stock suppliers
      const stockSuppliers = await this.supplierRepo.findAllAsync({
        where: { isStock: true },
      });

      if (!stockSuppliers || stockSuppliers.length === 0) {
        this.log.warn("No stock suppliers found");
        return [];
      }

      const aggregatedStock = [];

      for (const supplier of stockSuppliers) {
        // Get all deliveries for this stock supplier
        const deliveries = await this.deliveryRepo.findAllAsync({
          where: { supplierId: supplier.id },
          relations: ["deliveryItems"],
          order: { deliveryDate: "DESC" },
        });

        // Aggregate stock by fish type
        const stockByFishType = new Map();

        for (const delivery of deliveries) {
          for (const item of delivery.deliveryItems) {
            const key = item.fishTypeId;
            const existing = stockByFishType.get(key) || {
              fishTypeId: item.fishTypeId,
              fishTypeName: item.fishTypeName,
              totalAmount: 0,
              soldAmount: 0,
              remainingAmount: 0,
              totalValue: 0,
              averagePricePerKilo: 0,
            };

            existing.totalAmount += item.amount;
            existing.soldAmount += item.soldAmount;
            existing.remainingAmount += item.restAmount;
            existing.totalValue += item.totalPrice;

            // Calculate weighted average price
            if (existing.totalAmount > 0) {
              existing.averagePricePerKilo =
                existing.totalValue / existing.totalAmount;
            }

            stockByFishType.set(key, existing);
          }
        }

        aggregatedStock.push({
          supplierId: supplier.id,
          supplierName: supplier.name,
          stockItems: Array.from(stockByFishType.values()),
          totalItems: stockByFishType.size,
          lastUpdated:
            deliveries.length > 0 ? deliveries[0].deliveryDate : null,
        });
      }

      return aggregatedStock;
    } catch (error) {
      this.log.error("Error getting aggregated stock", error);
      throw error;
    }
  }
}
