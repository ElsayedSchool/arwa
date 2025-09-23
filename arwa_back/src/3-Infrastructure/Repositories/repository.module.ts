import { Module } from "@nestjs/common";
import { winstonLoggerConfig } from "src/3-Infrastructure/Logger/logger.config";
import {
  ProfileRepo,
  CategoryRepo,
  UserRepo,
  CustomerRepo,
  InventoryRepo,
  OrderRepo,
  SoldRepo,
  PaymentRepo,
  SupplierRepo,
  TruckRepo,
  TruckItemRepo,
  TypeRepo,
} from "./index";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  User,
  UserProfile,
  Category,
  Type,
  Customer,
  Inventory,
  Order,
  Sold,
  Payment,
  Supplier,
  Truck,
  TruckItem,
} from "src/2-Domain/index";
import { PhotosService } from "../PhotosApi/photos.service";
import { AppTimeModule } from "../timeService/time.Module";
import { TranslateModule } from "../Translation/tanslation.module";

@Module({
  imports: [
    // Only register entities that are exported from src/2-Domain/Entities/index.ts
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      Category,
      Type,
      Customer,
      Inventory,
      Order,
      Sold,
      Payment,
      Supplier,
      Truck,
      TruckItem,
    ]),
    ConfigModule,
    AppTimeModule,
    TranslateModule,
  ],
  providers: [
    {
      provide: "Logger", // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
    PhotosService,
    ProfileRepo,
    CategoryRepo,
    UserRepo,
    CustomerRepo,
    InventoryRepo,
    OrderRepo,
    SoldRepo,
    PaymentRepo,
    SupplierRepo,
    TruckRepo,
    TruckItemRepo,
    TypeRepo,
  ],
  exports: [
    ProfileRepo,
    CategoryRepo,
    ConfigModule,
    UserRepo,
    CustomerRepo,
    InventoryRepo,
    OrderRepo,
    SoldRepo,
    PaymentRepo,
    SupplierRepo,
    TruckRepo,
    TruckItemRepo,
    TypeRepo,
    {
      provide: "Logger", // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
  ],
})
export class RepositoryModule {}
