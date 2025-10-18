import { IsOptional, IsNotEmpty, IsString } from "class-validator";

export class UpsertCustomerCommand {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty({ message: "يجب إرسال الاسم" })
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsNotEmpty({ message: "يجب إرسال رقم الهاتف" })
  @IsString()
  phoneNumber!: string;
}
