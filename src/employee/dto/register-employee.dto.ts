import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class RegisterEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_company: number;

  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Validasi panjang password
  @IsNotEmpty()
  password: string;

  @IsNotEmpty() //harus dipakai agar muncul message Missing parameter telephone
  telephone: string;
}
