import { IsBoolean, IsEnum } from "class-validator";
import { UserRole } from "src/2-Domain";
import { IsUUIDKey } from "src/4-Application/20-Common";

export class ChangeEmployeeRoleCommand {
  @IsUUIDKey()
  id: string;

  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsBoolean()
  isAdmin: boolean;
}
