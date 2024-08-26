import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employee_general_information')
export class EmployeeGeneralInformation {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id_general_information: number;

  @Column({ type: 'character varying', length: 255 })
  user_idcard: string;

  @Column({ type: 'character varying', length: 255 })
  user_religion: string;

  @Column({ type: 'character varying', length: 255 })
  user_place_of_birth: string;

  @Column({ type: 'date' })
  user_date_of_birth: Date;

  @Column({ type: 'character varying', length: 255 })
  user_gender: string;

  @Column({ type: 'character varying', length: 255 })
  phone: string;

  @Column({ type: 'text' })
  user_addresses_idcard: string;

  @Column({ type: 'character varying', length: 255 })
  last_education: string;

  @Column({ type: 'text' })
  user_address_domicile: string;
  employees: any;
}
