import { IsBoolean, IsUUID } from "class-validator";

export class DeactivateEmployeeCommand {
  @IsUUID("4", { message: "بيانات المستخدم غير صحيحه" })
  id: string;

  @IsBoolean({ message: "بيانات المستخدم غير صحيحه" })
  isActive: boolean;
}
