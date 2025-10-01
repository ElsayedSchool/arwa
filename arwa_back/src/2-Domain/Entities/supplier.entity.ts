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
import { Delivery } from "./delivery.entity";
import { OrderItem } from "./orderItem.entity";

@Entity()
export class Supplier extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 30 })
  nickName: string;

  @Column({ length: 11 })
  phone: string;

  @Column({ length: 11, nullable: true })
  whatsApp: string;

  @Column({ type: "int", default: 0 })
  totalTrucks: number;

  @Column({ type: "decimal", default: 0 })
  totalWeight: number;

  @Column({ type: "decimal", default: 0 })
  totalMoney: number;

  @Column({ type: "decimal", default: 0 })
  totalPaid: number;

  @Column({ type: "decimal", default: 0 })
  totalDue: number;

  @UpdateDateColumn()
  lastUpdated: Date;

  @CreateDateColumn()
  JoinDate: Date;

  @OneToMany(() => Delivery, (delivery) => delivery.supplier)
  deliveries: Delivery[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.Supplier)
  orderItems: OrderItem[];
  // inherited soft-delete fields
}
