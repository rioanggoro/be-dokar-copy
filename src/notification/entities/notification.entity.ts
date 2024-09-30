import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id_notification: number;

  // Relasi Many-to-One ke Employee
  @ManyToOne(() => Employee, (employee) => employee.notifications)
  @JoinColumn({ name: 'employee_id' }) // Join column FK ke employee_id
  employee: Employee;

  @Column({ type: 'character varying', length: 100 })
  notification_type: string;

  @Column({ type: 'character varying', length: 255 })
  description: string;

  @Column({ type: 'character varying', length: 50 })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  notification_date: Date;

  @Column({ type: 'text' })
  token_auth: string;
}
