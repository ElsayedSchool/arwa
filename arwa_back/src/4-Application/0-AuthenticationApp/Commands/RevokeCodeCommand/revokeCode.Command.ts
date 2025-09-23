import { IsNotEmpty } from 'class-validator';

export class RevokeCodeCommand {
  @IsNotEmpty({ message: 'من فضلك قم بارسال بيانات المستخدم' })
  userId: string;
}
