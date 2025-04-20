import { IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity()
@Unique(['cod'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column()
  @IsNotEmpty()
  @IsString()
  cod: string

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string

  @Column()
  @IsNotEmpty()
  @IsString()
  picture_key: string
}
