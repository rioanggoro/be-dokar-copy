//Entity untuk merelasikan tabel tabel

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { GeneralInformation } from 'src/general_inforamtion/entities/general_inforamtion.entity';
import { JobInformation } from 'src/job_information/entities/job_information.entity';
import { PermissionAttendance } from 'src/permission_attendance/entities/permission_attendance.entity';
import { ClockIn } from 'src/clockin/entities/clockin.entity';
import { ClockOut } from 'src/clockout/entities/clockout.entity';
import { DebtRequest } from 'src/debt_request/entities/debt_request.entity';
import { PersonalInformation } from 'src/personal_information/entities/personal_information.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_employee: number;

  @OneToOne(() => PersonalInformation, { cascade: true })
  @JoinColumn({ name: 'personal_information_id' })
  personalInformation: PersonalInformation;

  // 1 employee have 1 employee general information
  @OneToOne(() => GeneralInformation, { cascade: true })
  @JoinColumn({ name: 'general_information_id' })
  generalInformation: GeneralInformation;

  @OneToOne(
    () => JobInformation,
    (jobInformation) => jobInformation.id_job_information,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'job_information_id' })
  jobInformation: JobInformation;

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

  //Relasi ke tabel permission_attendance
  @OneToMany(
    () => PermissionAttendance,
    (permissionAttendance) => permissionAttendance.employee,
  )
  permissionAttendances: PermissionAttendance[];

  @OneToMany(() => ClockIn, (clockin) => clockin.employee)
  clockins: ClockIn[];
  @OneToMany(() => ClockOut, (clockout) => clockout.employee)
  clockouts: ClockOut[];

  //Relasi ke tabel debt_request
  @OneToMany(() => DebtRequest, (debtRequest) => debtRequest.employee)
  debtRequests: DebtRequest[];
}
