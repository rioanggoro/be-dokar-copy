import { Injectable } from '@nestjs/common';
import { CreateClockinDto } from './dto/create-clockin.dto';
import { UpdateClockinDto } from './dto/update-clockin.dto';

@Injectable()
export class ClockinService {
  create(createClockinDto: CreateClockinDto) {
    return 'This action adds a new clockin';
  }

  findAll() {
    return `This action returns all clockin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clockin`;
  }

  update(id: number, updateClockinDto: UpdateClockinDto) {
    return `This action updates a #${id} clockin`;
  }

  remove(id: number) {
    return `This action removes a #${id} clockin`;
  }
}
