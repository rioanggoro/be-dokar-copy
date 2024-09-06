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
  private formatErrors(
    errors: any[],
    expectedTypes: Record<string, string>,
  ): string {
    const formattedMessages = new Map<string, string>();

    errors.forEach((err) => {
      const constraints = err.constraints;
      const expectedType = expectedTypes[err.property]; // Mendapatkan tipe data yang diharapkan
      const property = err.property;
      const value = err.value;

      // Jika parameter tidak ada sama sekali (undefined atau null)
      if (value === undefined || value === null) {
        if (!formattedMessages.has(property)) {
          formattedMessages.set(property, `Missing parameter: ${property}`);
        }
      } else {
        // Cek tipe data secara dinamis
        if (expectedType && typeof value !== expectedType) {
          formattedMessages.set(
            property,
            `${property} has invalid value '${value}': ${property} must be a ${expectedType}`,
          );
        }

        // Memproses constraint dan validasi lain
        Object.keys(constraints).forEach((key) => {
          const constraintMessage = constraints[key];

          // Jika nilai adalah string kosong
          if (value === '') {
            if (!formattedMessages.has(property)) {
              formattedMessages.set(property, `${property} cannot be empty`);
            }
          } else {
            // Jika sudah ada pesan sebelumnya, gabungkan pesan kesalahan
            if (formattedMessages.has(property)) {
              const existingMessage = formattedMessages.get(property);
              formattedMessages.set(
                property,
                `${existingMessage}, ${constraintMessage}`,
              );
            } else {
              formattedMessages.set(
                property,
                `${property} has invalid value '${value}', ${constraintMessage}`,
              );
            }
          }
        });
      }
    });

    // Gabungkan semua pesan kesalahan menjadi satu string
    return Array.from(formattedMessages.values()).join('; ');
  }
}
