import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { DebtRequest } from 'src/debt_request/entities/debt_request.entity';
import { JobInformation } from 'src/job_information/entities/job_information.entity';
import { PermissionAttendance } from 'src/permission_attendance/entities/permission_attendance.entity';

//Entity untuk merelasikan tabel tabel

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

  // @Column({ type: 'date' })
  // employee_payday: Date;

  @Column({ type: 'varchar', length: 10 })
  company_role: string;

  @Column({ type: 'interval' })
  late_tolerance: string;

  @Column({ type: 'date' })
  start_period_attendance: Date;

  @Column({ type: 'date' })
  end_period_attendance: Date;

  // 1 perusahaan have many employees
  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  // 1 perusahaan have many debt requests
  @OneToMany(() => DebtRequest, (debtRequest) => debtRequest.company)
  debtRequests: DebtRequest[];

  @OneToMany(() => JobInformation, (jobInformation) => jobInformation.company)
  jobInformations: JobInformation[];

  @OneToMany(
    () => PermissionAttendance,
    (permissionAttendance) => permissionAttendance.company,
  )
  permissionAttendances: PermissionAttendance[];
}
