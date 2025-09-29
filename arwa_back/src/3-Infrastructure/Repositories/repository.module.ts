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
  DeliveryRepo,
  DeliveryItemRepo,
} from "./index";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  User,
  UserProfile,
  Category,
  Customer,
  Inventory,
  Order,
  Sold,
  Payment,
  Supplier,
  Delivery,
  DeliveryItem,
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
      Customer,
      Inventory,
      Order,
      Sold,
      Payment,
      Supplier,
      Delivery,
      DeliveryItem,
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
    DeliveryRepo,
    DeliveryItemRepo,
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
    DeliveryRepo,
    DeliveryItemRepo,
    {
      provide: "Logger", // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
  ],
})
export class RepositoryModule {}
