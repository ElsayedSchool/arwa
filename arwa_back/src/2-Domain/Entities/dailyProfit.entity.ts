import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";

@Entity()
export class DailyProfit extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  profitDate: Date;

  @Column({ type: "decimal", default: 0, name: "total_salary_expenses" })
  totalSalaryExpenses: number;

  @Column({ type: "decimal", default: 0, name: "total_normal_expenses" })
  totalNormalExpenses: number;

  @Column({ type: "decimal", default: 0, name: "total_sold_fish_price" })
  totalSoldFishPrice: number;

  @Column({ type: "decimal", default: 0, name: "total_orders_sold_revenue" })
  totalOrdersSoldRevenue: number;

  @Column({ type: "decimal", default: 0, name: "net_profit" })
  netProfit: number;

  @UpdateDateColumn()
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;
}
