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
import { Truck } from "./truck.entity";

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

  @OneToMany(() => Truck, (truck) => truck.profile)
  trucks: Truck[];

  @Column({ nullable: true })
  deletedBy: string | null;
}
