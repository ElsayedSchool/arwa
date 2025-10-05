import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { UserProfile } from "./user-profile.entity";

@Entity()
export class StaffPayment extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  staffId: string;

  @ManyToOne(() => UserProfile, { onDelete: "SET NULL" })
  @JoinColumn({ name: "staffId", referencedColumnName: "id" })
  staff?: UserProfile | null;

  // Salary components per day
  @Column({ type: "decimal", default: 0 })
  baseSalary: number; // paid salary for the day

  @Column({ type: "decimal", default: 0 })
  overtime: number; // overtime compensation

  @Column({ type: "decimal", default: 0 })
  addedSalary: number; // bonuses/additions

  @Column({ type: "decimal", default: 0 })
  totalPerDay: number; // computed total for the day

  // record date (payment created time)
  @CreateDateColumn()
  createdAt: Date;
}
