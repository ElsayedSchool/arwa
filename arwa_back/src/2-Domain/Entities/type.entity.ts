import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { OneToMany } from "typeorm";
import { TruckItem } from "./truckItem.entity";

@Entity()
export class Type extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ default: false })
  isBase: boolean;

  @Column({ length: 100, nullable: true })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TruckItem, (ti) => ti.type)
  truckItems: TruckItem[];
  // soft-delete fields inherited from BaseDelete

  @Column({ nullable: true })
  deletedBy: string | null;
}
