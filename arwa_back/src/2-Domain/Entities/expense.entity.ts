import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";

@Entity()
export class Expense extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "decimal", default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}
