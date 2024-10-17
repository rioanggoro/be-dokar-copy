import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendancesettingDto } from './create-attendancesetting.dto';

export class UpdateAttendancesettingDto extends PartialType(CreateAttendancesettingDto) {}
