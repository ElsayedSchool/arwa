import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { IsNumberKey } from "src/4-Application/20-Common";

export class UpsertCategoryCommand {
  @IsNumberKey(false)
  id = 0;

  @IsNotEmpty({ message: "يجب ارسال الاسم" })
  @MinLength(3, { message: "الاسم يجب ان لا يقل عن 3 احرف" })
  @MaxLength(30, { message: "الاسم يجب ان لا يزيد عن 30 احرف" })
  name: string;

  // optional fields for main category
  description?: string;

  // when creating/editing subcategory
  type?: "main" | "sub";
  mainCategoryId?: number;
  character?: string;
  color?: string;
}
