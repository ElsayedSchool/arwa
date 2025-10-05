import { IsNumber } from "class-validator";

export class UpdateOrderPriceDto {
  @IsNumber({}, { message: "السعر الإجمالي يجب أن يكون رقماً" })
  totalPrice: number;
}

export class UpdateOrderPriceCommand {
  constructor(
    public orderId: string,
    public priceData: UpdateOrderPriceDto
  ) {}
}
