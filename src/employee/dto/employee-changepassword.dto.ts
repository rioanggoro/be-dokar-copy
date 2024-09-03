import { IsNotEmpty, IsString } from 'class-validator';
export class EmployeeChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;
}
