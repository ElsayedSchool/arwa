import { Not } from "typeorm";
import { UpsertDeliveryCommand } from "./upsertDelivery.Command";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";
import { CategoryRepo } from "src/3-Infrastructure/Repositories";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";
import { DeliveryItem } from "src/2-Domain/Entities";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpsertDeliveryHandler {
  constructor(
    private repo: DeliveryRepo,
    private categoryRepo: CategoryRepo,
    private deliveryItemRepo: DeliveryItemRepo,
    private supplierRepo: SupplierRepo
  ) {}

  async execute(cmd: UpsertDeliveryCommand) {
    const payload = cmd.payload;

    // Look up supplier by name to get supplierId
    let supplierId = payload.supplierId;
    if (payload.supplierName && !supplierId) {
      const suppliers = await this.supplierRepo.findAllAsync({
        where: { name: payload.supplierName, isDeleted: false },
      });
      if (suppliers && suppliers.length > 0) {
        supplierId = suppliers[0].id;
      }
    }

    // Full upsert (create/update with date/time) - payments handled separately
    const dateTimeString =
      String(payload.deliveryDate || "") +
      "T" +
      (String(payload.deliveryTime || "").length === 5
        ? String(payload.deliveryTime || "") + ":00"
        : String(payload.deliveryTime || ""));
    const deliveryDate = new Date(dateTimeString);
    if (isNaN(deliveryDate.getTime())) {
      throw new Error("Invalid delivery date/time");
    }

    const transformedPayload = {
      id: payload.id,
      supplierId: supplierId,
      supplierName: payload.supplierName,
      driverName: payload.driverName,
      deliveryDate,
      // Financial fields will be calculated after items are created
      totalDeliveryPrice: 0,
      totalPaidDelivery: 0,
      totalDebt: 0,
      discount: payload.discount || 0,
    } as any;

    // Create/update delivery first
    const delivery = await this.repo.saveAsync(transformedPayload);

    // Delete existing delivery items if this is an update
    if (payload.id) {
      await this.deliveryItemRepo.getRaw().delete({ deliveryId: delivery.id });
    }

    // Create delivery items
    if (payload.fishTypes && Array.isArray(payload.fishTypes)) {
      const deliveryItems: Partial<DeliveryItem>[] = [];

      for (const fishType of payload.fishTypes) {
        // Find category by name
        const categories = await this.categoryRepo.findAllAsync({
          where: { name: fishType.type, isDeleted: false },
        });

        if (categories && categories.length > 0) {
          deliveryItems.push({
            deliveryId: delivery.id,
            fishTypeId: categories[0].id,
            amount: fishType.weight || fishType.quantity || 0,
            pricePerKilo: fishType.pricePerKg || 0,
            totalPrice:
              (fishType.weight || fishType.quantity || 0) *
              (fishType.pricePerKg || 0),
          });
        }
      }

      // Save delivery items
      if (deliveryItems.length > 0) {
        await this.deliveryItemRepo.saveManyAsync(deliveryItems);
      }
    }

    // Calculate totals from delivery items
    const deliveryWithItems = await this.repo.findOneActive({
      where: { id: delivery.id },
      relations: ["deliveryItems"],
    });

    if (deliveryWithItems) {
      const totalDeliveryPrice =
        deliveryWithItems.deliveryItems?.reduce(
          (sum, item) => sum + Number(item.totalPrice || 0),
          0
        ) || 0;

      const discount = Number(deliveryWithItems.discount || 0);

      // Get the last delivery from the same supplier to get accumulated debt
      const lastSupplierDelivery = await this.repo.findAllAsync({
        where: {
          supplierId: deliveryWithItems.supplierId,
          isDeleted: false,
          id: Not(delivery.id), // Exclude current delivery if updating
        },
        order: { deliveryDate: "DESC" },
        take: 1,
      });

      // totalDebt = updatedDebt from the last delivery of the same supplier
      const totalDebt =
        lastSupplierDelivery && lastSupplierDelivery.length > 0
          ? Number(lastSupplierDelivery[0].updatedDebt || 0)
          : 0;

      // totalPaidDelivery starts at 0, will be updated via separate payment model
      const totalPaidDelivery = 0;

      // updatedDebt = totalDebt + totalDeliveryPrice - totalPaidDelivery - discount
      const updatedDebt = Math.max(
        0,
        totalDebt + totalDeliveryPrice - totalPaidDelivery - discount
      );

      // Update delivery with calculated totals
      await this.repo.saveAsync({
        id: delivery.id,
        totalDeliveryPrice,
        totalDebt,
        totalPaidDelivery,
        updatedDebt,
      });
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
        savedDelivery.totalDebt === 0
          ? "paid"
          : savedDelivery.totalPaidDelivery > 0
            ? "partial"
            : "unpaid",
      totalCost: savedDelivery.totalDeliveryPrice,
      amountPaid: savedDelivery.totalPaidDelivery,
      remainingAmount: savedDelivery.totalDebt,
      fishTypes:
        savedDelivery.deliveryItems?.map((item) => ({
          type: item.type?.name || "",
          weight: Number(item.amount),
          pricePerKg: 0, // Default price
        })) || [],
    };
  }
}
