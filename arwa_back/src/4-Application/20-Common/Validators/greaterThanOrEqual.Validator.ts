import { registerDecorator, ValidationOptions } from 'class-validator';

export function GreaterThanOrEqual(
  min = 0,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'GreaterThanOrEqual',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (
            value == null ||
            value == undefined ||
            value < min ||
            !Number.isInteger(value)
          ) {
            console.log('hello');
            return false;
          }
          return true;
        },
        defaultMessage() {
          // Return your constant error message here
          return `الرقم التعريفى يجب ان يكون اكبر من او يساوى ${min}`;
        },
      },
    });
  };
}
