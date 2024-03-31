/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AdjustLength(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'αdjustedLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          const trimmedValue = value.replace(/\s/g, '');
          return trimmedValue.length === length;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be ${length} characters long without whitespaces`;
        },
      },
    });
  };
}
