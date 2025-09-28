import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseDelete } from "./base-delete.entity";
import { UserRole } from "../Enums";
import { AuthProvider } from "../Enums/authProvider.Enum";
import { UserProfile } from "./user-profile.entity";

@Entity()
export class User extends BaseDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 70, nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, length: 70 })
  email: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ nullable: true })
  verificationCode: string;

  @Column({ nullable: true })
  verificationCodeExpirationDate: Date;

  // user provider id and provider type for login with provider
  @Column({ default: "" })
  userProviderId: string;

  @Column({
    type: "enum",
    default: AuthProvider.Credential,
    enum: AuthProvider,
    name: "AuthProvider",
  })
  authProvider: AuthProvider;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: "enum", enum: UserRole, array: true, nullable: true })
  roles: UserRole[];

  @Column({ default: "" })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @Column({ default: false })
  isProfileInit: boolean;

  @OneToOne(() => UserProfile, (profile) => profile.owner, {
    cascade: ["insert", "update"],
  })
  userProfile: UserProfile;

  // soft-delete and audit fields inherited from BaseDelete
}
