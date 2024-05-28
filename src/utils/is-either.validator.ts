import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

export function IsEither(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsEither',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === 'string' || Array.isArray(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Property must be a string or an array of strings';
                },
            },
        });
    };
}