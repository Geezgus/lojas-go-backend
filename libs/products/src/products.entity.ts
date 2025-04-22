import { IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity()
@Unique(['code'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsNotEmpty()
  @IsString()
  code: string

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string

  @Column()
  @IsNotEmpty()
  @IsString()
  picture_key: string
}
