import { IsUUID } from 'class-validator';

export class RemoveUserCommand {
  @IsUUID('4', { message: 'بيانات المستخدم غير صحيحه' })
  id: string;
}
