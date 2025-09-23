import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Order } from "./order.entity";

@Entity()
export class Sold extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  orderId: string | null;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "orderId" })
  order: Order | null;

  @Column()
  truckId: string;

  @Column()
  fishTypeId: string;

  @Column({ type: "decimal", default: 0 })
  amount: number;

  @Column({ type: "decimal", default: 0 })
  pricePerKilo: number;

  @Column({ type: "decimal", default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  date: Date;

  // soft-delete fields inherited from BaseDelete

  @Column({ nullable: true })
  deletedBy: string | null;
}
