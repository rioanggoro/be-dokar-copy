import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;
}
