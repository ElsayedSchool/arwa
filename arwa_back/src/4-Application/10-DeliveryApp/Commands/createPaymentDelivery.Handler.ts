import { Injectable } from "@nestjs/common";
import { Not } from "typeorm";
import {
  CreatePaymentDeliveryCommand,
  UpdatePaymentDeliveryCommand,
} from "./createPaymentDelivery.Command";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class CreatePaymentDeliveryHandler {
  constructor(private repo: DeliveryRepo) {}

  async execute(cmd: CreatePaymentDeliveryCommand) {
    const { supplierId, supplierName, paidAmount, discount, driverName } = cmd;

    // Find the last delivery for this supplier to get current debt
    const lastSupplierDelivery = await this.repo.findAllAsync({
      where: { supplierId, isDeleted: false },
      order: { deliveryDate: "DESC" },
      take: 1,
    });

    const currentDebt =
      lastSupplierDelivery.length > 0
        ? Number(lastSupplierDelivery[0].updatedDebt || 0)
        : 0;

    // Calculate new updated debt
    const newUpdatedDebt = Math.max(0, currentDebt - paidAmount - discount);

    // Create payment delivery
    const paymentDelivery = await this.repo.saveAsync({
      supplierId,
      supplierName,
      driverName,
      isPayment: true,
      totalDeliveryPrice: 0,
      totalPaidDelivery: paidAmount,
      discount,
      totalDebt: currentDebt,
      updatedDebt: newUpdatedDebt,
      deliveryDate: new Date(),
    });

    return paymentDelivery;
  }
}

@Injectable()
export class UpdatePaymentDeliveryHandler {
  constructor(private repo: DeliveryRepo) {}

  async execute(cmd: UpdatePaymentDeliveryCommand) {
    const { id, supplierId, supplierName, paidAmount, discount, driverName } =
      cmd;

    // Find the existing payment delivery
    const existingDelivery = await this.repo.findOneActive({ where: { id } });
    if (!existingDelivery || !existingDelivery.isPayment) {
      throw new Error("Payment delivery not found");
    }

    // Find the last delivery for this supplier (excluding the current one being updated)
    const lastSupplierDelivery = await this.repo.findAllAsync({
      where: { supplierId, isDeleted: false, id: Not(id) },
      order: { deliveryDate: "DESC" },
      take: 1,
    });

    const currentDebt =
      lastSupplierDelivery.length > 0
        ? Number(lastSupplierDelivery[0].updatedDebt || 0)
        : 0;

    // Calculate new updated debt
    const newUpdatedDebt = Math.max(0, currentDebt - paidAmount - discount);

    // Update payment delivery
    const updatedDelivery = await this.repo.saveAsync({
      id,
      supplierId,
      supplierName,
      driverName,
      isPayment: true,
      totalDeliveryPrice: 0,
      totalPaidDelivery: paidAmount,
      discount,
      totalDebt: currentDebt,
      updatedDebt: newUpdatedDebt,
      deliveryDate: existingDelivery.deliveryDate, // Keep original date
    });

    return updatedDelivery;
  }
}
