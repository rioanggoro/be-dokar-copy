import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditPhotoEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsString()
  @IsNotEmpty()
  photo: string;
}