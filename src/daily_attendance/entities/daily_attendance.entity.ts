import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

import { ClockIn } from 'src/clockin/entities/clockin.entity'; // Import ClockIn entity
import { ClockOut } from 'src/clockout/entities/clockout.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { MonthlyAttendance } from 'src/monthly_attendance/entities/monthly_attendance.entity';

@Entity('daily_attendance')
export class DailyAttendance {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_daily_attendance: number;

  @Column({ type: 'double precision' })
  catering_fee: number;

  @Column({ type: 'double precision' })
  meal_money: number;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'character varying', length: 1 })
  attend_status: string;

  @Column({ type: 'double precision' })
  half_day: number;

  @Column({ type: 'double precision' })
  overtime_total_hour: number;

  @OneToOne(() => ClockIn, (clockIn) => clockIn.dailyAttendance)
  @JoinColumn({ name: 'clock_in_id' })
  clockIn: ClockIn;

  @OneToOne(() => ClockOut, (clockOut) => clockOut.dailyAttendance)
  @JoinColumn({ name: 'clock_out_id' })
  clockOut: ClockOut;

  @OneToOne(() => Employee, (employee) => employee.dailyAttendance)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
