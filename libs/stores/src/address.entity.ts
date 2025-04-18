import { IsNotEmpty } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsNotEmpty()
  postalCode: string

  @Column()
  @IsNotEmpty()
  street: string

  @Column()
  @IsNotEmpty()
  number: string

  @Column({ nullable: true })
  complement?: string

  @Column()
  @IsNotEmpty()
  neighborhood: string

  @Column()
  @IsNotEmpty()
  city: string

  @Column()
  @IsNotEmpty()
  stateCode: string
}
