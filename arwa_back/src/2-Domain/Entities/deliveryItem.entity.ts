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
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "deliveryId" })
  delivery: Delivery | null;

  @Column()
  fishTypeId: number;

  @ManyToOne(() => Category, (category) => category.deliveryItems, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "fishTypeId" })
  type: Category;

  @Column({ default: "" })
  fishTypeName: string;

  @Column({ type: "decimal", default: 0 })
  amount: number;

  @Column({ type: "decimal", default: 0 })
  pricePerKilo: number;

  @Column({ type: "decimal", default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // soft-delete fields are inherited
}
