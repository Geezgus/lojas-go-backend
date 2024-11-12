import { CreateStoreDto, PartialUpdateStoreDto, UpdateStoreDto, Store } from '@lib/stores'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StoresService {
  findAll(): Promise<Store[]> {
    throw new Error('Method not implemented.')
  }

  findOne(id: string): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  create(dto: CreateStoreDto): Promise<Store> {
    throw new Error('Method not implemented.')
  }

  update(id: string, dto: UpdateStoreDto): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  partialUpdate(id: string, dto: PartialUpdateStoreDto): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }
}
