import { IsNotEmpty } from 'class-validator';

export class VerifyEmailCommand {
  @IsNotEmpty({ message: 'من فضلك قم بارسال بيانات المستخدم' })
  userId: string;

  @IsNotEmpty({ message: 'من فضلك قم بارسال كود التحقق' })
  code: string;
}
