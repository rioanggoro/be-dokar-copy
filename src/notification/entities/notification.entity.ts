import { Employee } from 'src/employee/entities/employee.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_notification: number;

  @Column()
  employee_id: number;

  @Column('text')
  token_device: string;

  @Column('varchar')
  notification_type: string;

  @Column('varchar')
  status: string;

  @Column('varchar')
  description: string;

  @Column('varchar')
  notification_date: string;

  @ManyToOne(() => Employee, (employee) => employee.notifications)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
