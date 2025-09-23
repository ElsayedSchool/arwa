import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";

@Entity()
export class Payment extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  customerId: string;

  @Column()
  orderId: string;

  @Column({ type: "decimal", default: 0 })
  totalDue: number;

  @Column({ type: "decimal", default: 0 })
  totalRequired: number;

  @Column({ type: "decimal", default: 0 })
  totalPaid: number;

  @Column({ type: "decimal", default: 0 })
  discount: number;

  @Column({ type: "decimal", default: 0 })
  finalDue: number;

  @CreateDateColumn()
  date: Date;

  // inherited soft-delete fields

  @Column({ nullable: true })
  deletedBy: string | null;
}
