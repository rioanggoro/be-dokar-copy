import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

//Entity untuk merelasikan tabel company

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_company: number;

  @Column({ type: 'varchar', length: 100 })
  company_name: string;

  @Column({ type: 'varchar', length: 100 })
  sector: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'float', precision: 9, scale: 6 })
  latitude: number;

  @Column({ type: 'float', precision: 9, scale: 6 })
  longitude: number;

  @Column({ type: 'float' })
  set_radius: number;

  @Column({ type: 'varchar', length: 15 })
  office_phone: string;

  @Column({ type: 'varchar', length: 15 })
  contact_person: string;

  @Column({ type: 'date' })
  employee_payday: Date;

  @Column({ type: 'varchar', length: 10 })
  company_role: string;

  // 1 perusahaan have many employees
  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];
}
