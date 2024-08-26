import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmployeeGeneralInformation } from './employee-general-information.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_employee: number;

  @Column({ type: 'integer' })
  personal_information_id: number;

  @ManyToOne(
    () => EmployeeGeneralInformation,
    (generalInformation) => generalInformation.id_general_information,
  )
  @JoinColumn({ name: 'general_information_id' })
  generalInformation: EmployeeGeneralInformation;

  @Column({ type: 'integer' })
  job_information_id: number;

  @Column({ type: 'integer' })
  company_id: number;

  @Column({ type: 'character varying', length: 100 })
  password: string;

  @Column({ type: 'text' })
  token_device: string;

  @Column({ type: 'text' })
  token_auth: string;

  @Column({ type: 'character varying', length: 100 })
  email: string;

  @Column({ type: 'character varying', length: 100 })
  employee_name: string;

  @Column({ type: 'text' })
  employee_photo: string;

  @Column({ type: 'integer' })
  shift_attendance_id: number;
}
