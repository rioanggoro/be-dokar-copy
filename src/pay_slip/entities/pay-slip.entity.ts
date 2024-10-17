import { Employee } from 'src/employee/entities/employee.entity';
import { MonthlyAttendance } from 'src/monthly_attendance/entities/monthly_attendance.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pay_slip')
export class PaySlip {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_pay_slip: number;

  @Column('double precision')
  daily_wage: number;

  @Column('double precision')
  monthly_wage: number;

  @Column('double precision')
  daily_wage_overtime: number;

  @Column('double precision')
  overtime_total: number;

  @Column('double precision')
  meal_money_total: number;

  @Column('double precision')
  grand_total: number;

  @Column('double precision')
  total_salary_minus_meals: number;

  @Column('double precision')
  pph: number;

  @Column('double precision')
  total_received: number;

  @OneToMany(
    () => MonthlyAttendance,
    (monthlyAttendance) => monthlyAttendance.paySlip,
  )
  monthlyAttendances: MonthlyAttendance[];
  salary_period: string;

  @OneToOne(() => Employee, (employee) => employee.paySlip)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
