import { PartialType } from '@nestjs/mapped-types';
import { CreateJobInformationDto } from './create-job_information.dto';

export class UpdateJobInformationDto extends PartialType(CreateJobInformationDto) {}
