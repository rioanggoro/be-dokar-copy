import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity()
export class ClockIn {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_clock_in: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'text' })
  attendance_photo: string;

  @Column({ type: 'date' })
  created_at: string;

  @Column({ type: 'time with time zone' })
  time: string;

  @ManyToOne(() => Employee, (employee) => employee.clockins)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
