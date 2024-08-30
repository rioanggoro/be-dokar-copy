import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PermissionAttendance } from 'src/permission_attendance/entities/permission_attendance.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_employee: number;

  @Column({ type: 'text' })
  token_auth: string;

  @Column({ type: 'varchar', length: 100 })
  user_name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'text' })
  photo: string;

  @Column({ type: 'text' })
  token_device: string;

  //Relasi ke tabel permission_attendance
  @OneToMany(
    () => PermissionAttendance,
    (permissionAttendance) => permissionAttendance.employee,
  )
  permissionAttendances: PermissionAttendance[];
}
