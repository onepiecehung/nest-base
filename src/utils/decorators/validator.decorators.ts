import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsArrayIn(
  property: string | string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isArrayIn',
      target: object.constructor,
      propertyName: propertyName,
      constraints: Array.isArray(property) ? property : [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const values = [...new Set(value)];
          const relatedPropertyName = args.constraints;
          for (const value of values) {
            if (!relatedPropertyName.includes(value)) {
              return false;
            }
          }
          return true; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
