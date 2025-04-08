import { Address } from '@lib/stores'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GeocodingService {
  constructor(private readonly httpService: HttpService) {}

  async getCoordinates(address: Address): Promise<{ latitude: number; longitude: number }> {
    const url = this.buildGeocodingUrl(address)
    const response = await this.httpService.get(url).toPromise()
    const location = response.data[0].geometry.location
    const { lat, lng } = location

    return { latitude: lat, longitude: lng }
  }

  private buildGeocodingUrl(address: Address): string {
    const formattedStreet = address.street.replace(/ /g, '+')
    const formattedNeighborhood = address.neighborhood.replace(/ /g, '+')
    const formattedCity = address.city.replace(/ /g, '+')

    const formattedAddress = `${address.number}+${formattedStreet},+${formattedNeighborhood},+${formattedCity},+${address.stateCode}`
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&components=postal_code:${address.postalCode}&key=${process.env.GOOGLE_MAPS_API_KEY}`

    return url
  }
}
