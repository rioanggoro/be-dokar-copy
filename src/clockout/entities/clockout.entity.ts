import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { DailyAttendance } from 'src/daily_attendance/entities/daily_attendance.entity';

@Entity()
export class ClockOut {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_clock_out: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'text' })
  attendance_photo: string;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'time with time zone' })
  time: string;

  @ManyToOne(() => Employee, (employee) => employee.clockouts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToOne(
    () => DailyAttendance,
    (dailyAttendance) => dailyAttendance.clockOut,
  )
  dailyAttendance: DailyAttendance[];
}
