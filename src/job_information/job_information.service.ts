import { Injectable } from '@nestjs/common';
import { CreateJobInformationDto } from './dto/create-job_information.dto';
import { UpdateJobInformationDto } from './dto/update-job_information.dto';

@Injectable()
export class JobInformationService {
  create(createJobInformationDto: CreateJobInformationDto) {
    return 'This action adds a new jobInformation';
  }

  findAll() {
    return `This action returns all jobInformation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobInformation`;
  }

  update(id: number, updateJobInformationDto: UpdateJobInformationDto) {
    return `This action updates a #${id} jobInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobInformation`;
  }
}
