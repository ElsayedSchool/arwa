import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { CategoryType } from "../Enums";
import { DeliveryItem } from "./deliveryItem.entity";

@Entity()
@Index(["mainCategoryId", "name"], { unique: true })
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

  @Column({ nullable: true })
  description?: string;

  // short character used in UI for this category/subcategory
  @Column({ length: 5, nullable: true })
  character?: string | null;

  // optional color hex/code for UI display
  @Column({ length: 20, nullable: true })
  color?: string | null;

  // If this category is a subcategory, `mainCategory` points to its parent.
  // If this is a base (main) category, `mainCategory` is null and `isBase` should be true.
  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "mainCategoryId" })
  mainCategory?: Category | null;

  // explicit FK column for queries and migrations
  @Column({ nullable: true })
  mainCategoryId?: number | null;

  // children (subcategories) - inverse side
  @OneToMany(() => Category, (category) => category.mainCategory)
  subcategories?: Category[];

  @OneToMany(() => DeliveryItem, (deliveryItem) => deliveryItem.type)
  deliveryItems?: DeliveryItem[];

  @Index()
  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @Column({ nullable: true })
  deletedBy: string | null;
}
