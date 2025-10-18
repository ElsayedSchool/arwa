import { IsNotEmpty, MaxLength, MinLength, IsIn } from "class-validator";
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

  @IsNotEmpty({ message: "يجب ارسال نوع الفئة" })
  @IsIn([1, 2, 3], {
    message:
      "نوع الفئة يجب ان يكون واحد من: 1 (بلطى), 2 (ابيض), 3 (مجمدات وبحر)",
  })
  categoryType: number;

  // when creating/editing subcategory
  type?: "main" | "sub";
  mainCategoryId?: number;
  character?: string;
  color?: string;
}
