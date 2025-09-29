import { IsUUID } from "class-validator";

export class GetEmployeeDetailQuery {
  @IsUUID(4, { message: "من فضلك ارسل البيانات صحيحه" })
  id: string;
}
