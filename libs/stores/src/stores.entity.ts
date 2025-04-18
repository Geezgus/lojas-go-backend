import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Address } from './address.entity'

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  @IsString()
  id?: string

  @Column()
  @IsNotEmpty()
  @IsString()
  user_id: string

  @Column()
  @IsNotEmpty()
  @IsString()
  cnpj: string

  @Column('float')
  @IsNotEmpty()
  @IsNumber()
  latitude: number

  @Column('float')
  @IsNotEmpty()
  @IsNumber()
  longitude: number

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string

  @Column()
  @IsNotEmpty()
  @IsString()
  picture_key: string

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  @ValidateNested()
  @Type(() => Address)
  address: Address
}
