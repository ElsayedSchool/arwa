import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { CategoryType } from "../Enums";

@Entity()
export class Category extends BaseDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  @Index({ unique: true })
  name: string;

  @Column({ nullable: false, default: true })
  isBase: boolean;

  @Column({
    type: "enum",
    default: CategoryType.بلطى,
    enum: CategoryType,
    name: "CategoryType",
  })
  catgeory: CategoryType;

  @Index()
  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @Column({ nullable: true })
  deletedBy: string | null;
}
