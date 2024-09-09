import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  id_employee: number;

  @IsString()
  notification_type: string;

  @IsString()
  description: string;

  @IsString()
  status: string;
}
