import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";
import { UserRole } from "src/2-Domain";

export class UpdateEmployeeCommand {
  @IsUUID("4", { message: "من فضلك ارسل بيانات المستخدم" })
  id: string;

  @IsNotEmpty({ message: "من فضلك ارسل اسم المستخدم الاول" })
  firstName: string;

  @IsNotEmpty({ message: "من فضلك ارسل اسم المستخدم الثانى" })
  lastName: string;

  @IsNotEmpty({ message: "من فضلك ارسل ايميل المستخدم" })
  email: string;

  @IsNotEmpty({ message: "من فضلك ارسل رقم التليفون" })
  phoneNumber: string;

  userRoles: UserRole[];

  @IsBoolean()
  isActive: boolean;
}
