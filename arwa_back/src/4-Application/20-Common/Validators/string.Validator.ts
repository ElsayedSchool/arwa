import { IsDefined, IsNotEmpty, Length } from 'class-validator';
import { IsNotNullValidator } from './notNull.Validator';

export function IsRequiredString(params: {
  isRequired?: boolean;
  maxLength?: number;
  propName?: string;
}) {
  return function (object: object, propertyName: string) {
    let { isRequired, maxLength, propName } = params;
    isRequired = isRequired || true;
    maxLength = maxLength || 500;
    propName = propName || propertyName;

    IsDefined({ message: `${propName} مطلوب` });
    if (isRequired) {
      IsNotEmpty({ message: `${propName} مطلوب` })(object, propName);
      Length(1, maxLength, {
        message: `${propName} يجب أن لا يزيد عدد الأحرف عن ${maxLength} حرف`,
      })(object, propName);
    }
  };
}
