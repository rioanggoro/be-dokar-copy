import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity('job_information')
export class JobInformation {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_job_information: number;

  @Column({ type: 'varchar', length: 100 })
  company_name: string;

  @Column({ type: 'varchar', length: 50 })
  user_department: string;

  @Column({ type: 'varchar', length: 50 })
  user_position: string;

  @Column({ type: 'date' })
  user_entry_date: Date;

  @Column({ type: 'varchar', length: 50 })
  user_status: string;

  @Column({ type: 'varchar', length: 100 })
  shift: string;

  @Column({ type: 'time without time zone' })
  late_tolerance: string;

  @Column({ type: 'varchar', length: 50 })
  attendance_mode: string;

  @Column({ type: 'boolean' })
  out_of_office_attendance: boolean;

  @Column({ type: 'double precision' })
  salary_per_day: number;
  @OneToOne(() => Employee, (employee) => employee.jobInformation)
  employee: Employee;
}
