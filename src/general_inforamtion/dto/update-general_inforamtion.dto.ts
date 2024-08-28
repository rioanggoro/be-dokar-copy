import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralInforamtionDto } from './create-general_inforamtion.dto';

export class UpdateGeneralInforamtionDto extends PartialType(CreateGeneralInforamtionDto) {}
