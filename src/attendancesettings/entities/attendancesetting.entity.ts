import { Employee } from 'src/employee/entities/employee.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('attendance_settings')
export class AttendanceSetting {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_attendance_settings: number;

  @OneToOne(() => Employee, (employee) => employee.attendanceSetting)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'character varying', length: 50 })
  absensi_type: string;

  @Column({ type: 'date', nullable: true })
  custom_start_date: Date;

  @Column({ type: 'date', nullable: true })
  custom_end_date: Date;

  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
