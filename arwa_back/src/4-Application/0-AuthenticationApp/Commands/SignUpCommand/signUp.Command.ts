import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { IsEqualTo } from 'src/4-Application/20-Common';

export class SignUpCommand {
  @IsNotEmpty({ message: 'من فضلك ارسل اسم المستخدم' })
  username: string;

  @IsEmail({ require_tld: true }, { message: 'الايميل المرسل غير مقبول' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'كلمه السر يجب ان تحتوى على حروف كبيره وصغيره وارقام ولا تقل عن 8 احرف',
    },
  )
  @MaxLength(30, { message: 'كلمه السر يجب ان لا تزيد عن 30 حرف' })
  password: string;

  @IsEqualTo('password')
  confirmPassword: string;

  //@IsNotEmpty({ message: 'من فضلك ارسل البيانات الخاصه بارسال تنبيهات' })
  fcmToken: string;
}
