import { Length, IsNotEmpty } from 'class-validator';
import { IsNotNullValidator } from './notNull.Validator';

export function IsPhoneNumber(isRequired = true, lenght = 8) {
  return function (object: object, propertyName: string) {
    IsNotNullValidator()(object, 'رقم التليفون');
    if (isRequired) {
      IsNotEmpty({ message: 'يجب ارسال رقم التليفون' })(object, propertyName);
      Length(lenght, lenght, {
        message: 'رقم التليفون يجب ان يكون ${length} ارقام',
      })(object, propertyName);
    }
  };
}
