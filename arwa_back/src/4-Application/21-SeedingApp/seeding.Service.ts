import { INestApplication, Injectable } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Category, User } from "src/2-Domain";
import { UserRole } from "src/2-Domain/Enums/userRole.Enum";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { Repository } from "typeorm";
import { Logger } from "winston";

@Injectable()
export class SeedingService {
  private userRepo: Repository<User>;
  private bcryptSer: BcryptService;
  private logger: Logger;

  constructor(private app: INestApplication) {
    this.userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    this.bcryptSer = app.get<BcryptService>(BcryptService);
    this.logger = app.get<Logger>("Logger");
  }

  async SeedData() {
    try {
      await this.seedUsers();
    } catch (err) {
      this.logger.error("An error occurred while seeding. Please check this.");
    }
  }

  private async seedUsers() {
    const hasAny = await this.userRepo.count();
    if (hasAny == 0) {
      const admin = new User();
      admin.email = process.env.ADMIN_USERNAME;
      admin.roles = [UserRole.Admin];
      admin.isActive = true;
      admin.isAdmin = true;
      admin.password = await this.bcryptSer.getHashedPassword(
        process.env.ADMIN_PASSWORD
      );
      await this.userRepo.save(admin);
    }
  }
}
