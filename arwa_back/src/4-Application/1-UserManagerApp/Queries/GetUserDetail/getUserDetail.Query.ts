import { IsUUID } from 'class-validator';

export class GetUserDetailQuery {
  @IsUUID(4, { message: 'من فضلك ارسل البيانات صحيحه' })
  id: string;
}
