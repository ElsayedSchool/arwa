import { boolean } from "joi";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { OneToMany } from "typeorm";
import { Supplier } from "./supplier.entity";
import { UserProfile } from "./user-profile.entity";
import { DeliveryItem } from "./deliveryItem.entity";

@Entity()
export class Delivery extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // supplier data
  @Column({ nullable: true })
  supplierId: string | null;

  @ManyToOne(() => Supplier, (supplier) => supplier.deliveries, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "supplierId" })
  supplier: Supplier | null;

  @Column({ length: 100 })
  supplierName: string;

  @Column({ length: 100, nullable: true })
  driverName: string;

  // receiver data
  @Column({ nullable: true })
  receivedById: string;

  @Column({ length: 100, nullable: true })
  receivedByName: string;

  @ManyToOne(() => UserProfile, (profile) => profile.deliveries, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "receivedById" })
  profile: UserProfile | null;

  @UpdateDateColumn()
  lastUpdated: Date;

  @Column({ type: "decimal", default: 0 })
  totalPrice: number;

  @Column({ type: "decimal", default: 0 })
  totalPaid: number;

  @Column({ type: "decimal", default: 0 })
  totalDue: number;

  @OneToMany(() => DeliveryItem, (di) => di.delivery)
  deliveryItems: DeliveryItem[];
  // inherits soft-delete fields from BaseDelete

  @CreateDateColumn()
  deliveryDate: Date;
}
