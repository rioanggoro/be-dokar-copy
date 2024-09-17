import { Employee } from 'src/employee/entities/employee.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity('general_information')
export class GeneralInformation {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_general_information: number;

  @Column({ type: 'character varying', length: 20 })
  user_idcard: string;

  @Column({ type: 'character varying', length: 50 })
  user_religion: string;

  @Column({ type: 'character varying', length: 20 })
  user_place_of_birth: string;

  @Column({ type: 'date' })
  user_date_of_birth: Date;

  @Column({ type: 'character varying', length: 15 })
  user_gender: string;

  @Column({ type: 'character varying', length: 15 })
  phone: string;

  @Column({ type: 'text' })
  user_addresses_idcard: string;

  @Column({ type: 'character varying', length: 50 })
  last_education: string;

  @Column({ type: 'text' })
  user_address_domicile: string;
  employees: any;

  @OneToOne(() => Employee, (employee) => employee.generalInformation)
  employee: Employee;
}
