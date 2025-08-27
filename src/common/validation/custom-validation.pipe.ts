import {
  ValidationPipe,
  BadRequestException,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface ValidationErrorResponse {
  [key: string]: string | ValidationErrorResponse; // Can be an array of strings or a nested object
}

export class CustomValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors: ValidationError[]) => {
        const result: ValidationErrorResponse = {};

        errors.forEach((error) => {
          const propertyName: string = error.property;

          if (error.constraints) {
            const firstErrorMessage = Object.values(error.constraints)[0];
            result[propertyName] = firstErrorMessage!;
          }

          // Handle nested errors
          if (error.children && error.children.length > 0) {
            error.children.forEach((childError) => {
              const childPropertyName: string = childError.property;
              if (!result[propertyName]) {
                result[propertyName] = {};
              }

              const firstChildErrorMessage = Object.values(
                childError.constraints || {},
              )[0];

              (result[propertyName] as ValidationErrorResponse)[
                childPropertyName
              ] = firstChildErrorMessage!;
            });
          }
        });

        throw new BadRequestException({
          errors: result,
          error: 'Bad Request',
          statusCode: 422,
        });
      },
    });
  }
}
