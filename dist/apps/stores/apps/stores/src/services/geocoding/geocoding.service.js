"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
let GeocodingService = class GeocodingService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getCoordinates(address) {
        const url = this.buildGeocodingUrl(address);
        const response = await this.httpService.get(url).toPromise();
        const location = response.data.results[0].geometry.location;
        const { lat, lng } = location;
        return { latitude: lat, longitude: lng };
    }
    buildGeocodingUrl(address) {
        const formattedStreet = address.street.replace(/ /g, '+');
        const formattedNeighborhood = address.neighborhood.replace(/ /g, '+');
        const formattedCity = address.city.replace(/ /g, '+');
        const formattedAddress = `${address.number}+${formattedStreet},+${formattedNeighborhood},+${formattedCity},+${address.stateCode}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&components=postal_code:${address.postalCode}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        return url;
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map