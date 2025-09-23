import {
  ValidationOptions,
  Length,
  IsNotEmpty,
  registerDecorator,
} from 'class-validator';

export function IsNotNullValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value == null || value == undefined) return false;
          return true;
        },
        defaultMessage() {
          // Return your constant error message here
          return `${propertyName} غير معرف`;
        },
      },
    });
  };
}
