import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_company: number;

  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Validasi panjang password
  password: string;

  @IsString()
  telephone: string;
}
