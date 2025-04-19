import { IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity()
@Unique(['sub'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  @IsString()
  id: string

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string

  @Column()
  @IsNotEmpty()
  @IsString()
  email: string

  @Column()
  @IsNotEmpty()
  @IsString()
  sub: string
}
