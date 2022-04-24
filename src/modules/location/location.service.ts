import { Injectable } from '@nestjs/common';

import { ResponseLocationDto } from './dto/response-location.dto';
import { AddLocationDto } from './dto/add-location.dto';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class LocationService {
  constructor(private readonly neo4jService: Neo4jService) {}

  create(
    createLocationDto: AddLocationDto,
    deviceId: string,
  ): Promise<ResponseLocationDto> {
    return this.neo4jService.addLocation(createLocationDto, deviceId);
  }

  findAll(deviceId: string, limit?: number): Promise<ResponseLocationDto[]> {
    return this.neo4jService.getLocationList(deviceId, limit);
  }
}
