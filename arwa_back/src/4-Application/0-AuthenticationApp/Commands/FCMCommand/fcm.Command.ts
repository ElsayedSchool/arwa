import { IsNotEmpty } from 'class-validator';

export class FCMCommand {
  @IsNotEmpty({ message: 'من فضلك ارسل البيانات الخاصه بارسال تنبيهات' })
  fcmToken: string;
}
