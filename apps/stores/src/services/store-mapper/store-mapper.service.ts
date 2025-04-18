import { Store, StoreSummaryDto, StoreWebResponseDto } from '@lib/stores'
import { Injectable } from '@nestjs/common'
import { S3Service } from '../s3/s3.service'

@Injectable()
export class StoreMapperService {
  constructor(private s3Service: S3Service) {}

  async mapToWebDto(store: Store): Promise<StoreWebResponseDto> {
    const imageUrl = await this.s3Service.getImageUrl(store.picture_key)
    return {
      id: store.id,
      cnpj: store.cnpj,
      name: store.name,
      picture_url: imageUrl,
      address: store.address,
    }
  }

  async mapToSummary(store: Store): Promise<StoreSummaryDto> {
    const imageUrl = await this.s3Service.getImageUrl(store.picture_key)

    return { id: store.id, user_id: store.user_id, cnpj: store.cnpj, name: store.name, picture_url: imageUrl }
  }
}
