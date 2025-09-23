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
import { TruckItem } from "./truckItem.entity";

@Entity()
export class Truck extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // supplier data
  @Column({ nullable: true })
  supplierId: string | null;

  @ManyToOne(() => Supplier, (supplier) => supplier.trucks, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "supplierId" })
  supplier: Supplier | null;

  @ManyToOne(() => UserProfile, (profile) => profile.trucks, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "receivedById" })
  profile: UserProfile | null;

  @Column({ length: 100 })
  supplierName: string;

  @Column({ length: 100, nullable: true })
  driverName: string;

  @CreateDateColumn()
  deliveryDate: Date;

  @UpdateDateColumn()
  lastUpdated: Date;

  // receiver data
  @Column({ nullable: true })
  receivedById: string;

  @Column({ length: 100, nullable: true })
  receivedByName: string;

  // truck total price data
  @Column({ default: false })
  isPriceUpdated: boolean;

  @Column({ type: "decimal", default: 0 })
  totalPrice: number;

  @Column({ type: "decimal", default: 0 })
  totalPaid: number;

  @Column({ type: "decimal", default: 0 })
  totalDue: number;

  @OneToMany(() => TruckItem, (ti) => ti.truck)
  truckItems: TruckItem[];
  // inherits soft-delete fields from BaseDelete

  @Column({ nullable: true })
  deletedBy: string | null;
}
