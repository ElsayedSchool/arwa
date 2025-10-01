import { UpdateOrderItemsCommand } from "./updateOrderItems.Command";
import { OrderRepo } from "src/3-Infrastructure/Repositories";
import { OrderItemRepo } from "src/3-Infrastructure/Repositories";
import { CategoryRepo } from "src/3-Infrastructure/Repositories";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";
import { Injectable } from "@nestjs/common";
import { OrderItem } from "src/2-Domain/Entities";
import { CategoryType } from "src/2-Domain/Enums";

@Injectable()
export class UpdateOrderItemsHandler {
  constructor(
    private repo: OrderRepo,
    private orderItemRepo: OrderItemRepo,
    private categoryRepo: CategoryRepo,
    private supplierRepo: SupplierRepo
  ) {}

  async execute(cmd: UpdateOrderItemsCommand) {
    const payload = cmd.payload;

    // Verify order exists
    const order = await this.repo.getRaw().findOne({
      where: { id: payload.id },
    });

    if (!order) {
      throw new Error(`Order with id ${payload.id} not found`);
    }

    // Delete existing order items
    await this.orderItemRepo.getRaw().delete({ orderId: payload.id });

    // Create new order items
    if (payload.orderItems && Array.isArray(payload.orderItems)) {
      const orderItems: Partial<OrderItem>[] = [];

      for (const fishItem of payload.orderItems) {
        // Find category by name (using the sub-type)
        const categories = await this.categoryRepo.getRaw().find({
          where: { name: fishItem.fishTypeName, isDeleted: false },
        });

        let category: any;
        if (categories.length === 0) {
          // Create category if it doesn't exist
          if (!fishItem.fishTypeName || fishItem.fishTypeName.trim() === "") {
            throw new Error(`Category type is required for fish item`);
          }

          try {
            const newCategory = await this.categoryRepo.getRaw().save({
              name: fishItem.fishTypeName.trim(),
              isBase: false,
              catgeory: CategoryType.بلطى, // Use enum value - TODO: determine based on baseType
              description: `Auto-created category for ${fishItem.fishTypeName}`,
              character: fishItem.fishTypeName.slice(-1), // Last character as character
              color: "#3B82F6", // Default blue color
              mainCategoryId: null, // TODO: Link to parent category based on baseType
              deletedBy: null,
            });
            category = newCategory;
          } catch (error) {
            console.error("Error creating category:", error);
            throw new Error(
              `Failed to create category ${fishItem.fishTypeName}: ${error.message}`
            );
          }
        } else {
          category = categories[0];
        }

        // Find supplier by name
        const suppliers = await this.supplierRepo.getRaw().find({
          where: { name: fishItem.SupplierName, isDeleted: false },
        });

        let supplierId: string;
        if (suppliers.length === 0) {
          // Create supplier if it doesn't exist
          if (!fishItem.SupplierName || fishItem.SupplierName.trim() === "") {
            throw new Error(`Supplier name is required for fish item`);
          }

          const newSupplier = await this.supplierRepo.getRaw().save({
            name: fishItem.SupplierName.trim(),
            nickName: fishItem.SupplierName.trim().substring(0, 30), // Ensure nickName is not null and within length limit
            phone: "0000000000", // Default phone
            whatsApp: null,
            totalTrucks: 0,
            totalWeight: 0,
            totalMoney: 0,
            totalPaid: 0,
            totalDue: 0,
            lastUpdated: new Date(),
            JoinDate: new Date(),
            deletedBy: null,
          });
          supplierId = newSupplier.id.toString();
        } else {
          supplierId = suppliers[0].id.toString();
        }

        const orderItem: Partial<OrderItem> = {
          orderId: payload.id,
          SupplierId: supplierId,
          fishTypeId: category.id.toString(),
          fishTypeName: category.name,
          SupplierName: fishItem.SupplierName,
          amount: fishItem.amount || 0,
          pricePerKilo: 0, // TODO: Get from pricing logic
          totalPrice: 0, // TODO: Calculate amount * pricePerKilo
          date: new Date(),
        };

        orderItems.push(orderItem);
      }

      // Save all order items
      if (orderItems.length > 0) {
        await this.orderItemRepo.getRaw().save(orderItems);
      }
    }

    // Return the updated order with items
    return this.repo.getRaw().findOne({
      where: { id: payload.id },
      relations: ["orderItems"],
    });
  }
}
