import { IsInt, MIN, Min } from "class-validator";

export class GetAllEmployeesQuery {
  @IsInt()
  @Min(0)
  skip = 0;

  @IsInt()
  @Min(25)
  take = 25;
}
