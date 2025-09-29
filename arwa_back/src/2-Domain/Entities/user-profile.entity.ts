import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Delivery } from "./delivery.entity";

@Entity()
export class UserProfile {
  // start of analysis data
  @Index({ unique: true })
  @PrimaryColumn("uuid", { nullable: false, unique: true })
  id: string;

  @Column({ nullable: false, length: 30, default: "" })
  name: string;

  @Column({ default: 0 })
  salary: number;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({ nullable: true, length: 20 })
  phoneNumber: string | null;

  @Column({ default: "" })
  fcmToken: string;

  // with user account
  @OneToOne(() => User, (user) => user.userProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  owner: User;

  @OneToMany(() => Delivery, (delivery) => delivery.profile)
  deliveries: Delivery[];

  @Column({ nullable: true })
  deletedBy: string | null;
}
