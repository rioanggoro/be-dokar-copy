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

  @ManyToOne(() => Employee, (employee) => employee.notifications)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column('varchar')
  notification_type: string;

  @Column('varchar')
  description: string;

  @Column('varchar')
  status: string;

  @Column('varchar')
  notification_date: string;

  @Column({ type: 'text' })
  token_auth: string;
}
