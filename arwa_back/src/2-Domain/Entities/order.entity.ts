import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Customer } from "./customer.entity";
import { OrderItem } from "./orderItem.entity";

@Entity()
export class Order extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  customerId: string | null;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "customerId" })
  customer: Customer | null;

  @Column({ default: "" })
  customerName: string;

  @Column({ type: "decimal", default: 0 })
  totalPrice: number;

  @Column({ type: "decimal", default: 0 })
  totalDebt: number;

  @Column({ type: "decimal", default: 0 })
  paid: number;

  @Column({ type: "decimal", default: 0 })
  discount: number;

  @Column({ type: "decimal", default: 0 })
  updatedDebt: number;

  @CreateDateColumn()
  createAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems: OrderItem[];
}
