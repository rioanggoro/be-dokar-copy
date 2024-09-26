import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('permission_attendance')
export class PermissionAttendance {
  @PrimaryGeneratedColumn('increment')
  id_approval: number;

  @ManyToOne(() => Company, (company) => company.permissionAttendances)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Employee, (employee) => employee.permissionAttendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', length: 50 })
  department: string;

  @Column({ type: 'varchar', length: 100 })
  company_name: string;

  @Column({ type: 'varchar', length: 100 })
  employee_name: string;

  @Column({ type: 'varchar', length: 50 })
  position: string;

  @Column({ type: 'text' })
  proof_of_attendance: string;

  @Column({ type: 'date' })
  date_start: Date;

  @Column({ type: 'date' })
  date_finish: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'date' })
  date_request_permission: Date;
}
