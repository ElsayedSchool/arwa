import { Min } from 'class-validator';

export class RemoveCategoryCommand {
  @Min(0, { message: 'من فضلك ارسل بيانات النوع صحيحه' })
  id: number;
}
