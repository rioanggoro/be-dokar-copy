import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('debt_request')
export class DebtRequest {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_debt_request: number;

  @ManyToOne(() => Company, (company) => company.debtRequests)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // Foreign key to employee
  @ManyToOne(() => Employee, (employee) => employee.debtRequests)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'character varying', length: 100 })
  company_name: string;

  @Column({ type: 'character varying', length: 100 })
  employee_name: string;

  @Column({ type: 'date' })
  created_at: string;

  @Column({ type: 'double precision', precision: 10, scale: 2 })
  nominal_request: number;

  @Column({ type: 'double precision', precision: 10, scale: 2 })
  grand_total_request: number;

  @Column({ type: 'double precision', precision: 10, scale: 2 })
  admin_fee: number;

  @Column({ type: 'character varying', length: 20 })
  status: string;

  @Column({ type: 'character varying', length: 50 })
  bank_name: string;

  @Column({ type: 'character varying', length: 20 })
  account_number: string;

  @Column({ type: 'character varying', length: 100 })
  account_name: string;

  @Column({ type: 'double precision', precision: 10, scale: 2 })
  borrowing_cost: number;

  @Column({ type: 'varchar', length: 50 })
  department: string;
}
