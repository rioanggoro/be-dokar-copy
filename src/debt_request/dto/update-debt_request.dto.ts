import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtRequestDto } from './create-debt_request.dto';

export class UpdateDebtRequestDto extends PartialType(CreateDebtRequestDto) {}
