import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateClockOutDto {
  @IsNotEmpty()
  @IsNumber()
  id_employee: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsString()
  photo: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;
}
