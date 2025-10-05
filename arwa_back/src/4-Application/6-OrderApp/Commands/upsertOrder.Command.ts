import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderItem } from "src/2-Domain";

export class OrderItemDto {
  @IsString()
  @IsOptional()
  id?: string;

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

export class UpsertOrderDto {
  @IsString()
  @IsOptional()
  id?: string | null;

  @IsString()
  @IsNotEmpty({ message: "معرف العميل مطلوب" })
  customerId: string;

  @IsString()
  @IsNotEmpty({ message: "اسم العميل مطلوب" })
  customerName: string;

  @IsNumber({}, { message: "إجمالي الدين يجب أن يكون رقماً" })
  @IsOptional()
  totalDebt?: number;

  @IsNumber({}, { message: "المبلغ المدفوع يجب أن يكون رقماً" })
  @IsOptional()
  paid?: number;

  @IsNumber({}, { message: "الخصم يجب أن يكون رقماً" })
  @IsOptional()
  discount?: number;

  @IsNumber({}, { message: "الدين المحدث يجب أن يكون رقماً" })
  @IsOptional()
  updatedDebt?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty({ message: "يجب إضافة عناصر الطلب" })
  orderItems: OrderItemDto[];
}

export class UpsertOrderCommand {
  constructor(public payload: UpsertOrderDto) {}
}
