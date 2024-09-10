import { Injectable } from '@nestjs/common';
import { CreateDebtRequestDto } from './dto/create-debt_request.dto';
import { UpdateDebtRequestDto } from './dto/update-debt_request.dto';

@Injectable()
export class DebtRequestService {
  create(createDebtRequestDto: CreateDebtRequestDto) {
    return 'This action adds a new debtRequest';
  }

  findAll() {
    return `This action returns all debtRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} debtRequest`;
  }

  update(id: number, updateDebtRequestDto: UpdateDebtRequestDto) {
    return `This action updates a #${id} debtRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} debtRequest`;
  }
}
