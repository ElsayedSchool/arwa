import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User, UserProfile } from "src/2-Domain";
import { UserRole } from "src/2-Domain/Enums/userRole.Enum";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { UserRepo } from "src/3-Infrastructure/Repositories";
import { Logger } from "winston";

@Injectable()
export class SeedDataService {
  constructor(
    private userRepo: UserRepo,
    private configSer: ConfigService,
    @Inject("Logger") private log: Logger,
    private bcryptSer: BcryptService
  ) {}

  async SeedData() {
    try {
      await this.seedUsers();
      await this.seedMainPage();
      await this.seedCountry();
      await this.seedAnalysis();
    } catch (err) {
      this.log.error(
        "An error occurred while seeding. Please check this.",
        err
      );
    }
  }

  private async seedCountry() {}

  private async seedUsers() {
    const hasAny = (await this.userRepo.getAllAsync()).length;
    if (hasAny == 0) {
      const admin1 = new User();
      admin1.username = process.env.ADMIN_USERNAME;
      admin1.email = process.env.ADMIN_USERNAME;
      admin1.roles = [UserRole.Admin];
      admin1.isAdmin = true;
      admin1.emailConfirmed = true;
      admin1.password = await this.bcryptSer.getHashedPassword(
        process.env.ADMIN_PASSWORD
      );

      await this.userRepo.saveAsync(admin1);
    }
  }

  private async seedMainPage() {}

  private async seedAnalysis() {}
}
