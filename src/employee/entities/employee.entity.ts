//Entity untuk merelasikan tabel tabel

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { GeneralInforamtion } from 'src/general_inforamtion/entities/general_inforamtion.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_employee: number;

  @Column({ type: 'integer' })
  personal_information_id: number;

  // 1 employee have 1 employee general information
  @OneToOne(() => GeneralInforamtion, { cascade: true })
  @JoinColumn({ name: 'general_information_id' })
  generalInformation: GeneralInforamtion;

  @Column({ type: 'integer' })
  job_information_id: number;

  // banyak karyawan di 1 perusahaan
  @ManyToOne(() => Company, (company) => company.employees)
  @JoinColumn({ name: 'company_id' })
  company: Company;

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
