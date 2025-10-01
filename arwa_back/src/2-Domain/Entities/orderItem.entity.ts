import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  UpdateDateColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Order } from "./order.entity";
import { Category } from "./category.entity";
import { Supplier } from "./supplier.entity";

@Entity()
export class OrderItem extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // order data and is required
  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "orderId" })
  order: Order;

  // fish type data is required
  @Column({ nullable: true })
  fishTypeId: string | null;

  @Column()
  fishTypeName: string;

  @ManyToOne(() => Category, (category) => category.OrderItem, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "fishTypeId" })
  fishType: Category;

  // supplier data and is required
  @Column({ nullable: true })
  SupplierId: string | null;

  @Column()
  SupplierName: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.orderItems, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "SupplierId" })
  Supplier: Supplier;

  @Column({ type: "decimal", default: 0 })
  amount: number;

  @Column({ type: "decimal", default: 0 })
  pricePerKilo: number;

  @Column({ type: "decimal", default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
