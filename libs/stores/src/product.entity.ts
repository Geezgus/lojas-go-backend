import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Store } from './stores.entity'

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  @IsString()
  id?: string

  @Column()
  @IsNotEmpty()
  @IsString()
  code: string

  @Column('float')
  @IsNotEmpty()
  @IsNumber()
  price: number

  @Column()
  @IsNotEmpty()
  @IsString()
  status: string

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Store, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  @IsNotEmpty()
  store: Store
}
