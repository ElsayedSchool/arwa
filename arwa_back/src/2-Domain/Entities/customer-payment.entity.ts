import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Customer } from "./customer.entity";
import { Order } from "./order.entity";

@Entity()
export class CustomerPayment extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Relations
  @Column()
  customerId: string | null;

  @ManyToOne(() => Customer, { onDelete: "SET NULL" })
  @JoinColumn({ name: "customerId", referencedColumnName: "id" })
  customer?: Customer | null;

  @Column({ length: 100 })
  customerName: string;

  @Column()
  orderId: string | null;

  @ManyToOne(() => Order, { onDelete: "SET NULL" })
  @JoinColumn({ name: "orderId", referencedColumnName: "id" })
  order?: Order | null;

  // Amounts
  @Column({ type: "decimal", default: 0 })
  dueMoney: number; // initial due before this payment

  @Column({ type: "decimal", default: 0 })
  orderTotalPrice: number;

  @Column({ type: "decimal", default: 0 })
  amountPaid: number;

  @Column({ type: "decimal", default: 0 })
  discount: number;

  @Column({ type: "decimal", default: 0 })
  restOfDueMoney: number; // due after applying payment/discount

  @CreateDateColumn()
  createdAt: Date;
}
