import { IsNotEmpty, IsNumber } from 'class-validator';

export class EditPhotoEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  photo: Express.Multer.File;
}
