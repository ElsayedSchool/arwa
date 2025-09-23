import { IsUUID } from 'class-validator';

export function IsUUIDKey() {
  return function (object: object, propertyName: string) {
    IsUUID('4', { message: 'من فضلك ارسل البيانات صحيحه' })(
      object,
      propertyName,
    );
  };
}
