import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Order } from "./order.entity";

@Entity()
export class Customer extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  nickname: string;

  @Column({ length: 30 })
  phoneNumber: string;

  @Column({ type: "decimal", default: 0 })
  totalTransaction: number;

  @Column({ type: "decimal", default: 0 })
  totalPaid: number;

  @Column({ type: "decimal", default: 0 })
  totalDue: number;

  @Column({ default: 1 })
  viewOrder: number;

  @UpdateDateColumn()
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @Column({ nullable: true })
  deletedBy: string | null;
}
