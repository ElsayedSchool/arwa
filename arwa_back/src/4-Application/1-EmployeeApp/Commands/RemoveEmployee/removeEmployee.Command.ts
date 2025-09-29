import { IsUUID } from "class-validator";

export class RemoveEmployeeCommand {
  @IsUUID("4", { message: "بيانات المستخدم غير صحيحه" })
  id: string;
}
