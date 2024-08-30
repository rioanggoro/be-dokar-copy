import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity('permission_attendance')
export class PermissionAttendance {
  @PrimaryGeneratedColumn('increment')
  id_approval: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  proof_of_attendance: string;

  @ManyToOne(() => Employee, (employee) => employee.permissionAttendances)
  employee: Employee;
}
