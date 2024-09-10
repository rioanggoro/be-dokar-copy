import { Injectable } from '@nestjs/common';
import { CreateClockoutDto } from './dto/create-clockout.dto';
import { UpdateClockoutDto } from './dto/update-clockout.dto';

@Injectable()
export class ClockoutService {
  create(createClockoutDto: CreateClockoutDto) {
    return 'This action adds a new clockout';
  }

  findAll() {
    return `This action returns all clockout`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clockout`;
  }

  update(id: number, updateClockoutDto: UpdateClockoutDto) {
    return `This action updates a #${id} clockout`;
  }

  remove(id: number) {
    return `This action removes a #${id} clockout`;
  }
}
