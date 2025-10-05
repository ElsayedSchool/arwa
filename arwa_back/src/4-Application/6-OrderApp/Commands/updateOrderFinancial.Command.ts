import { IsNumber, IsOptional } from "class-validator";

export class UpdateOrderFinancialDto {
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
}

export class UpdateOrderFinancialCommand {
  constructor(
    public orderId: string,
    public financialData: UpdateOrderFinancialDto
  ) {}
}
