import { IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';
import { UserRole } from 'src/2-Domain';
import { IsEqualTo } from 'src/4-Application/20-Common';

export class UpsertUserCommand {
  id: string;

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
      message:
        'كلمه السر يجب ان تحتوى على حروف كبيره وصغيره وارقام ولا تقل عن 8 احرف',
    },
  )
  @MaxLength(30, { message: 'كلمه السر يجب ان لا تزيد عن 30 حرف' })
  password: string;

  @IsEqualTo('password')
  confirmPassword: string;

  @IsNotEmpty({ message: 'من فضلك ارسل اسم المستخدم الاول' })
  firstName: string;

  @IsNotEmpty({ message: 'من فضلك ارسل اسم المستخدم الثانى' })
  lastName: string;

  @IsNotEmpty({ message: 'من فضلك ارسل ايميل المستخدم' })
  email: string;

  @IsNotEmpty({ message: 'من فضلك ارسل رقم التليفون' })
  phoneNumber: string;

  roles: string;
  coinsBalance: number;

  isActive: boolean;
}
