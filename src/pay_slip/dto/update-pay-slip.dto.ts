import { PartialType } from '@nestjs/mapped-types';
import { CreatePaySlipDto } from './create-pay-slip.dto';

export class UpdatePaySlipDto extends PartialType(CreatePaySlipDto) {}
