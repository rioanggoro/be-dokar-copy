import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Digunakan untuk memverifiaksi apakah user tipe data parameter yang diisikan oleh user sudah benar atau belum
@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        status: 'Bad Request',
        message: this.formatErrors(errors),
      });
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    const formattedMessages = new Set<string>(); // Menggunakan Set untuk menghindari duplikasi pesan

    errors.forEach((err) => {
      const constraints = err.constraints;

      // Jika parameter tidak ada sama sekali (undefined)
      if (err.value === undefined || err.value === null) {
        formattedMessages.add(`Missing parameter: ${err.property}`);
      } else {
        // Memproses constraint dan validasi lain
        Object.keys(constraints).forEach((key) => {
          const constraintMessage = constraints[key];

          // Jika nilai adalah string kosong
          if (err.value === '') {
            formattedMessages.add(`${err.property} cannot be empty`);
          }
          // Menangani tipe data yang salah, misalnya email bukan string
          else if (err.property === 'email' && typeof err.value !== 'string') {
            formattedMessages.add(`${err.property} must be a string`);
          }
          // Menangani validasi format atau constraint lain
          else {
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
