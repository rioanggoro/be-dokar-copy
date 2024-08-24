import { Test, TestingModule } from '@nestjs/testing';
import { RegisterEmployeeService } from './register-employee.service';
import { ConflictException } from '@nestjs/common';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';

describe('RegisterEmployeeService', () => {
  let service: RegisterEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterEmployeeService],
    }).compile();

    service = module.get<RegisterEmployeeService>(RegisterEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new employee', async () => {
    const createEmployeeDto: CreateEmployeeDto = {
      id_company: 1,
      id_employee: 2,
      email: 'user@example.com',
      password: 'password123',
      telephone: '12345678',
    };

    const result = await service.register(createEmployeeDto);

    expect(result).toEqual({
      statusCode: 200,
      status: 'success',
      message: 'Register successful',
      token_auth: 'aBJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    });
  });

  it('should throw an error if email already exists', async () => {
    const createEmployeeDto: CreateEmployeeDto = {
      id_company: 1,
      id_employee: 2,
      email: 'user@example.com',
      password: 'password123',
      telephone: '12345678',
    };

    // Register the first time
    await service.register(createEmployeeDto);

    // Try to register again with the same email
    await expect(service.register(createEmployeeDto)).rejects.toThrow(
      new ConflictException({
        statusCode: 500,
        status: 'Error',
        message: 'account is already registered, please use another account',
      }),
    );
  });
});
