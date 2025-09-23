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
import { Sold } from "./orderItem.entity";

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

  @Column()
  workerId: string;

  @Column({ type: "decimal", default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  date: Date;

  @OneToMany(() => Sold, (item) => item.order)
  orderItems: Sold[];

  @Column({ nullable: true })
  deletedBy: string | null;
}
