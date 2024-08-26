import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_company: number;

  @Column({ type: 'character varying', length: 100 })
  company_name: string;

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];
}
