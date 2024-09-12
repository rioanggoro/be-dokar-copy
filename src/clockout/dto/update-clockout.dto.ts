import { PartialType } from '@nestjs/mapped-types';
import { CreateClockoutDto } from './create-clockout.dto';

export class UpdateClockoutDto extends PartialType(CreateClockoutDto) {}
