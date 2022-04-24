import { Injectable } from '@nestjs/common';

import { ResponseDeviceDto } from './dto/response-device.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class DeviceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  create(createDeviceDto: CreateDeviceDto): Promise<ResponseDeviceDto> {
    return this.neo4jService.createDevice(createDeviceDto);
  }

  findById(id: string): Promise<ResponseDeviceDto> {
    return this.neo4jService.getDevice(id);
  }
}
