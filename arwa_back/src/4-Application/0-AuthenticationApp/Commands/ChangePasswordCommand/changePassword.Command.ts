import { IsStrongPassword, IsUUID } from 'class-validator';
import { IsEqualTo } from 'src/4-Application/20-Common';

export class ChangePasswordCommand {
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
  newPassword: string;

  @IsEqualTo('newPassword')
  passwordConfirm: string;
}
