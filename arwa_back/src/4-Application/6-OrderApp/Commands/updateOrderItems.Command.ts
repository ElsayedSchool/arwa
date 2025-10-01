import {
  IsString,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderItem } from "src/2-Domain";

export class OrderItemDto {
  @IsString()
  @IsOptional()
  fishTypeId?: string;

  @IsString()
  @IsNotEmpty({ message: "اسم نوع السمك مطلوب" })
  fishTypeName: string;

  @IsString()
  @IsOptional()
  SupplierId?: string;

  @IsString()
  @IsNotEmpty({ message: "اسم المورد مطلوب" })
  SupplierName: string;

  @IsNumber({}, { message: "الكمية يجب أن تكون رقماً" })
  amount: number;
}

export class UpdateOrderItemsDto {
  @IsString()
  @IsNotEmpty({ message: "رقم الطلب مطلوب" })
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

export class UpdateOrderItemsCommand {
  constructor(public payload: UpdateOrderItemsDto) {}
}
