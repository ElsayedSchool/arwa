import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User, UserProfile, Supplier } from "src/2-Domain";
import { UserRole } from "src/2-Domain/Enums/userRole.Enum";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { UserRepo } from "src/3-Infrastructure/Repositories";
import { SupplierRepo } from "src/3-Infrastructure/Repositories/Repositories/supplier.repository";
import { Logger } from "winston";

@Injectable()
export class SeedDataService {
  constructor(
    private userRepo: UserRepo,
    private supplierRepo: SupplierRepo,
    private configSer: ConfigService,
    @Inject("Logger") private log: Logger,
    private bcryptSer: BcryptService
  ) {}

  async SeedData() {
    try {
      await this.seedUsers();
      await this.seedSuppliers();
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

  private async seedSuppliers() {
    const ownerSuppliers = await this.supplierRepo.findAllAsync({
      where: { isOwner: true },
    });
    if (ownerSuppliers.length === 0) {
      const ownerSupplier = new Supplier();
      ownerSupplier.name = "اسماك اروى";
      ownerSupplier.nickName = "اروى";
      ownerSupplier.phone = "00000000000";
      ownerSupplier.whatsApp = "00000000000";
      ownerSupplier.isOwner = true;
      ownerSupplier.isStock = false;
      ownerSupplier.totalTrucks = 0;
      ownerSupplier.totalWeight = 0;
      ownerSupplier.totalMoney = 0;
      ownerSupplier.totalPaid = 0;
      ownerSupplier.totalDue = 0;

      await this.supplierRepo.saveAsync(ownerSupplier);
      this.log.info("Owner supplier 'اسماك اروى' seeded successfully");
    }

    const stockSuppliers = await this.supplierRepo.findAllAsync({
      where: { isStock: true },
    });
    if (stockSuppliers.length === 0) {
      const stockSupplier = new Supplier();
      stockSupplier.name = "المخزون اليومي";
      stockSupplier.nickName = "مخزون";
      stockSupplier.phone = "00000000000";
      stockSupplier.whatsApp = "00000000000";
      stockSupplier.isOwner = false;
      stockSupplier.isStock = true;
      stockSupplier.totalTrucks = 0;
      stockSupplier.totalWeight = 0;
      stockSupplier.totalMoney = 0;
      stockSupplier.totalPaid = 0;
      stockSupplier.totalDue = 0;

      await this.supplierRepo.saveAsync(stockSupplier);
      this.log.info("Stock supplier 'المخزون اليومي' seeded successfully");
    }
  }

  private async seedMainPage() {}

  private async seedAnalysis() {}
}
