import { Test, TestingModule } from '@nestjs/testing';
import { RegisterEmployeeController } from './register-employee.controller';
import { RegisterEmployeeService } from './register-employee.service';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';

describe('RegisterEmployeeController', () => {
  let controller: RegisterEmployeeController;
  let service: RegisterEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterEmployeeController],
      providers: [
        {
          provide: RegisterEmployeeService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegisterEmployeeController>(
      RegisterEmployeeController,
    );
    service = module.get<RegisterEmployeeService>(RegisterEmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new employee', async () => {
    const createEmployeeDto: CreateEmployeeDto = {
      id_company: 1,
      id_employee: 2,
      email: 'user@example.com',
      password: 'password123',
      telephone: '12345678',
    };

    const result = {
      statusCode: 200,
      status: 'success',
      message: 'Register successful',
      token_auth: 'aBJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    };

    jest.spyOn(service, 'register').mockResolvedValue(result);

    expect(await controller.register(createEmployeeDto)).toBe(result);
  });
});
