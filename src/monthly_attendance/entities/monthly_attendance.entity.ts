import { DailyAttendance } from 'src/daily_attendance/entities/daily_attendance.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { PaySlip } from 'src/pay_slip/entities/pay-slip.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monthly_attendance')
export class MonthlyAttendance {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_monthly_attendance: number;

  @Column({ type: 'double precision' })
  catering_fee: number;

  @Column({ type: 'double precision' })
  meal_money: number;

  @Column({ type: 'double precision' })
  overtime_total: number;

  @Column({ type: 'int' })
  attend: number;

  @Column({ type: 'int' })
  permit: number;

  @Column({ type: 'int' })
  alpha: number;

  @Column({ type: 'double precision' })
  half_day: number;

  @Column({ type: 'varchar' })
  salary_period: string;

  @Column({ type: 'double precision' })
  attend_total: number;

  @Column({ type: 'varchar' })
  work_total: string;

  @ManyToOne(
    () => DailyAttendance,
    (dailyAttendance) => dailyAttendance.monthlyAttendance,
  )
  @JoinColumn({ name: 'daily_attendance_id' })
  dailyAttendance: DailyAttendance;

  // Tambahkan relasi Many-to-One ke Employee
  @OneToOne(() => Employee, (employee) => employee.monthlyAttendance)
  @JoinColumn({ name: 'employee_id' }) // Foreign key
  employee: Employee;

  // Relasi Many-to-One dengan TotalMonthlyAttendance
  @ManyToOne(() => PaySlip, (PaySlip) => PaySlip.monthlyAttendances)
  @JoinColumn({ name: 'pay_slip_id' })
  paySlip: PaySlip;
}
