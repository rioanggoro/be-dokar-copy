import { Injectable } from '@nestjs/common';
import { CreateGeneralInforamtionDto } from './dto/create-general_inforamtion.dto';
import { UpdateGeneralInforamtionDto } from './dto/update-general_inforamtion.dto';

@Injectable()
export class GeneralInforamtionService {
  create(createGeneralInforamtionDto: CreateGeneralInforamtionDto) {
    return 'This action adds a new generalInforamtion';
  }

  findAll() {
    return `This action returns all generalInforamtion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generalInforamtion`;
  }

  update(id: number, updateGeneralInforamtionDto: UpdateGeneralInforamtionDto) {
    return `This action updates a #${id} generalInforamtion`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalInforamtion`;
  }
}
