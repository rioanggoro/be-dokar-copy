import { Injectable } from '@nestjs/common';
import { CreatePersonalInformationDto } from './dto/create-personal_information.dto';
import { UpdatePersonalInformationDto } from './dto/update-personal_information.dto';

@Injectable()
export class PersonalInformationService {
  create(createPersonalInformationDto: CreatePersonalInformationDto) {
    return 'This action adds a new personalInformation';
  }

  findAll() {
    return `This action returns all personalInformation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personalInformation`;
  }

  update(id: number, updatePersonalInformationDto: UpdatePersonalInformationDto) {
    return `This action updates a #${id} personalInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} personalInformation`;
  }
}
