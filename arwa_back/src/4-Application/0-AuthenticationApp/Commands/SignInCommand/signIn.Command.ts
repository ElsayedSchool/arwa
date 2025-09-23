import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignInCommand {
  @IsNotEmpty({ message: 'من فضلك ارسل اسم المستخدم' })
  username: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message: 'اسم المستخدم او كلمه المرور غير صحيحه',
    },
  )
  password: string;

  //@IsNotEmpty({ message: 'من فضلك ارسل البيانات الخاصه بارسال تنبيهات' })
  fcmToken: string;
}
