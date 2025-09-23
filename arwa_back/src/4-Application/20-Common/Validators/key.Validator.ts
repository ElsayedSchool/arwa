import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNumberKey(
  isRequired = true,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumberKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (
            value == undefined ||
            value < 0 ||
            (isRequired && (value == null || value == 0)) ||
            !Number.isInteger(value)
          )
            return false;
          return true;
        },
        defaultMessage() {
          // Return your constant error message here
          return `الرقم التعريفى يجب ان تكون رقم صحيح`;
        },
      },
    });
  };
}
