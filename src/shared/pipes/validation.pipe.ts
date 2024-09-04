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
    return errors
      .map((err) => {
        // Jika properti yang divalidasi adalah 'email'
        if (err.property === 'email') {
          // Jika constraint memiliki 'isNotEmpty', ambil pesan tersebut
          if (err.constraints.isNotEmpty) {
            return 'Email is required';
          }

          // Jika constraint adalah format email
          if (err.constraints.isEmail) {
            return 'Email must be a valid email';
          }
        }

        // Jika properti yang divalidasi adalah 'password'
        if (err.property === 'password') {
          if (err.constraints.isNotEmpty) {
            return 'Password is required';
          }
        }

        // Jika properti yang divalidasi adalah 'new_password'
        if (err.property === 'new_password') {
          if (err.constraints.isNotEmpty) {
            return 'New password is required';
          }
        }

        // Kondisi umum untuk properti lain
        const constraintMessages = Object.values(err.constraints).join(', ');
        return `${err.property} has wrong value ${err.value}, ${constraintMessages}`;
      })
      .join('; ');
  }
}
