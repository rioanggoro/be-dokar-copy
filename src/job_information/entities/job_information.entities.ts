import { Employee } from 'src/employee/entities/employee.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('job_information')
export class EmployeeJobInformation {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_job_information: number;

  @Column({ type: 'integer' })
  company_id: number;

  @Column({ type: 'character varying', length: '100' })
  company_name: string;

  @Column({ type: 'character varying', length: '50' })
  user_department: string;

  @Column({ type: 'character varying', length: '50' })
  user_position: string;

  @Column({ type: 'date' })
  user_entry_date: Date;

  @Column({ type: 'character varying', length: '50' })
  user_status: string;

  @Column({ type: 'character varying', length: '50' })
  shift: string;

  @Column({ type: 'time with time zone', length: '50' })
  late_tolerance: string;

  @Column({ type: 'character varying', length: '50' })
  attandance_mode: string;

  @Column({ type: 'boolean' })
  out_of_office_attendance: boolean;

  @Column({ type: 'double precision' })
  salary_per_day: number;

  @OneToOne(() => Employee, (employee) => employee.jobInformation)
  employee: Employee;
}
