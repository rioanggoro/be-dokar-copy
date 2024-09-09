import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity()
export class ClockIn {
  @PrimaryGeneratedColumn()
  id_clock_in: number;

  @Column()
  address: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  attendance_photo: string;

  @Column('date')
  created_at: string;

  @Column('time')
  time: string;

  @ManyToOne(() => Employee, (employee) => employee.clockins)
  employee: Employee;
}
