import { PartialType } from '@nestjs/mapped-types';
import { CreateClockinDto } from './create-clockin.dto';

export class UpdateClockinDto extends PartialType(CreateClockinDto) {}
