import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity('personal_information')
export class PersonalInformation {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_personal_information: number;

  @Column({ type: 'integer' })
  tax_identification_number: number;

  @Column({ type: 'character varying', length: 20 })
  id_card: string;

  @Column({ type: 'integer' })
  tax_type_id: number;

  @Column({ type: 'boolean' })
  tax_deduction: boolean;

  @Column({ type: 'integer' })
  tax_allowance: number;

  @Column({ type: 'character varying', length: 100 })
  bank_name: string;

  @Column({ type: 'integer' })
  account_number: number;

  @Column({ type: 'character varying', length: 100 })
  account_name: string;

  @Column({ type: 'character varying', length: 20 })
  health_card: string;

  @Column({ type: 'character varying', length: 20 })
  work_card: string;

  @Column({ type: 'date' })
  registration_period: Date;

  @OneToOne(() => Employee, (employee) => employee.personalInformation)
  employee: Employee;
}
