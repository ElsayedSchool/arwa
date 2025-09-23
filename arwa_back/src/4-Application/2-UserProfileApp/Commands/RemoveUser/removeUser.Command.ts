import { IsNotEmpty } from 'class-validator';

export class RemoveUserCommand {
  @IsNotEmpty({ message: 'من فضلك ارسل الايميل الخاص بك' })
  email: string;
}
