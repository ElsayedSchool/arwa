import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { Supplier } from "./supplier.entity";
import { Delivery } from "./delivery.entity";

@Entity()
export class SupplierPayment extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Relations
  @Column()
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: "SET NULL" })
  @JoinColumn({ name: "supplierId", referencedColumnName: "id" })
  supplier?: Supplier | null;

  @Column({ length: 100 })
  supplierName: string;

  @Column()
  deliveryId: string;

  @ManyToOne(() => Delivery, { onDelete: "SET NULL" })
  @JoinColumn({ name: "deliveryId", referencedColumnName: "id" })
  delivery?: Delivery | null;

  // Amounts
  @Column({ type: "decimal", default: 0 })
  dueMoney: number;

  @Column({ type: "decimal", default: 0 })
  deliveryTotalPrice: number;

  @Column({ type: "decimal", default: 0 })
  amountPaid: number;

  @Column({ type: "decimal", default: 0 })
  discount: number;

  @Column({ type: "decimal", default: 0 })
  restOfDueMoney: number;

  @CreateDateColumn()
  createdAt: Date;
}
