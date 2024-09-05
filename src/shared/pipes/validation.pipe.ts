import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import 'reflect-metadata'; // Untuk menggunakan Reflect API

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    const expectedTypes = this.getExpectedTypes(metatype, value); // Mendapatkan tipe data yang diharapkan

    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        status: 'Bad Request',
        message: this.formatErrors(errors, expectedTypes), // Menggunakan tipe data yang diharapkan dalam pesan error
      });
    }

    return value;
  }

  // Memeriksa apakah tipe data membutuhkan validasi
  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  // Mengambil tipe data yang diharapkan untuk setiap properti menggunakan Reflect API
  private getExpectedTypes(metatype: any, value: any): Record<string, string> {
    const expectedTypes: Record<string, string> = {};
    for (const key of Object.keys(value)) {
      const type = Reflect.getMetadata('design:type', metatype.prototype, key);
      if (type) {
        expectedTypes[key] = type.name.toLowerCase(); // Menyimpan tipe data dalam format lowercase (string, number, dll.)
      }
    }
    return expectedTypes;
  }

  // Memformat pesan error dan memeriksa tipe data secara dinamis
  private formatErrors(errors: any[], expectedTypes: Record<string, string>) {
    const formattedMessages = new Set<string>();

    errors.forEach((err) => {
      const constraints = err.constraints;
      const expectedType = expectedTypes[err.property]; // Mendapatkan tipe data yang diharapkan

      // Jika parameter tidak ada sama sekali (undefined atau null)
      if (err.value === undefined || err.value === null) {
        formattedMessages.add(`Missing parameter: ${err.property}`);
      } else {
        // Cek tipe data secara dinamis
        if (expectedType && typeof err.value !== expectedType) {
          formattedMessages.add(
            `${err.property} must be of type ${expectedType}`,
          );
        }

        // Memproses constraint dan validasi lain
        Object.keys(constraints).forEach((key) => {
          const constraintMessage = constraints[key];

          // Jika nilai adalah string kosong
          if (err.value === '') {
            formattedMessages.add(`${err.property} cannot be empty`);
          } else {
            formattedMessages.add(
              `${err.property} has invalid value '${err.value}': ${constraintMessage}`,
            );
          }
        });
      }
    });

    return Array.from(formattedMessages).join('; ');
  }
}
