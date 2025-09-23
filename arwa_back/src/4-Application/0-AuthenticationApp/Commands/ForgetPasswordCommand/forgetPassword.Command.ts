import { IsEmail } from 'class-validator';

export class ForgetPasswordCommand {
  @IsEmail({ require_tld: true }, { message: 'الايميل المرسل غير مقبول' })
  email: string;
}
