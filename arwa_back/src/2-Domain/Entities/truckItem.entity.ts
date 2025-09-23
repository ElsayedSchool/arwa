import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Truck } from "./truck.entity";
import { Type } from "./Type.entity";

@Entity()
export class TruckItem extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  truckId: string | null;

  @ManyToOne(() => Truck, (truck) => truck.truckItems, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "truckId" })
  truck: Truck | null;

  @Column({ nullable: true })
  typeId: string | null;

  @ManyToOne(() => Type, (type) => type.truckItems, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "typeId" })
  type: Type | null;

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
