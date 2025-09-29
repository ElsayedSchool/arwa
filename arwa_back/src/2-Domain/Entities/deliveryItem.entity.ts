import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Delivery } from "./delivery.entity";
import { Category } from "./category.entity";

@Entity()
export class DeliveryItem extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "deliveryId", nullable: true })
  deliveryId: string | null;

  @ManyToOne(() => Delivery, (delivery) => delivery.deliveryItems, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "deliveryId" })
  delivery: Delivery | null;

  @Column({ nullable: true })
  typeId: string | null;

  @ManyToOne(() => Category, (category) => category.deliveryItems, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "typeId" })
  type: Category | null;

  @Column({ type: "decimal", default: 0 })
  amount: number;

  @Column({ length: 50, nullable: true })
  classification: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // soft-delete fields are inherited

  @Column({ nullable: true })
  deletedBy: string | null;
}
