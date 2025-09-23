import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";

@Entity()
export class Inventory extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  truckId: string;

  @Column()
  fishTypeId: string;

  @Column({ length: 100 })
  typeName: string;

  @Column({ type: "decimal", default: 0 })
  amount: number;

  @CreateDateColumn()
  date: Date;
  // soft-delete fields are inherited from BaseDelete

  @Column({ nullable: true })
  deletedBy: string | null;
}
