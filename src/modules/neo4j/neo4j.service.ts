import neo4j, { Driver } from 'neo4j-driver';
import * as Crypto from 'crypto';
import {
  OnModuleDestroy,
  OnModuleInit,
  Injectable,
  Logger,
} from '@nestjs/common';

import { AddLocationDto } from '../location/dto/add-location.dto';
import { CreateDeviceDto } from '../device/dto/create-device.dto';
import { Location } from './entities/location.entity';
import { Device } from './entities/device.entity';
import config from '../../config/neo4j.config';

@Injectable()
export class Neo4jService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(Neo4jService.name);
  private readonly driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      config.uri,
      neo4j.auth.basic(config.user, config.password),
    );
  }

  async onModuleInit(): Promise<void> {
    const serverInfo = await this.driver.verifyConnectivity();
    this.logger.log(
      `Connected to Neo4j Server (Version: ${serverInfo.version})`,
    );
  }

  async getDevice(id: string): Promise<Device> {
    const cypher = `
MATCH (node:Device { id: $id })
RETURN node, apoc.date.toISO8601(node.createdAt) as createdAt
`;

    const session = this.driver.session();
    const result = await session.run(cypher, { id });
    await session.close();

    return Device.fromRecord(result.records?.[0]);
  }

  async createDevice(device: CreateDeviceDto): Promise<Device> {
    const cypher = `
CREATE (node:Device {
  id: apoc.create.uuid(),
  name: $name,
  createdAt: TIMESTAMP(),
  permissions: $permissions,
  key: $key
})
RETURN node, apoc.date.toISO8601(node.createdAt) as createdAt
`;

    const session = this.driver.session();
    const result = await session.run(cypher, {
      name: device.name,
      permissions: device.permissions,
      key: Crypto.randomBytes(128).toString('base64url'),
    });
    await session.close();

    return Device.fromRecord(result.records?.[0]);
  }

  async getLocationList(deviceId: string, limit = 25): Promise<Location[]> {
    const cypher =
      'MATCH (node:Location { device: $device }) RETURN node, apoc.date.toISO8601(node.at) as at ORDER BY node.at DESC LIMIT toInteger($limit)';
    const session = this.driver.session();
    const result = await session.run(cypher, {
      device: deviceId,
      limit,
    });

    await session.close();
    return result.records.map(Location.fromRecord);
  }

  async addLocation(
    location: AddLocationDto,
    deviceId: string,
  ): Promise<Location> {
    const cypher = `
CALL apoc.do.when(true, 'OPTIONAL MATCH (node:Location { device: $device }) RETURN node ORDER BY node.at DESC LIMIT 1', '', {
  device: $device
})
YIELD value
WITH value.node as fNode

MATCH (dev:Device { id: $device })
CREATE (n:Location {
  id: apoc.create.uuid(),
  device: $device,
  at: TIMESTAMP(),
  lng: $lng,
  lat: $lat
})-[:BELONGS_TO]->(dev)
WITH n as cNode, fNode

CALL apoc.do.when(fNode IS NULL, 'RETURN $cNode as cn', 
'CALL apoc.create.relationship($cNode, $r, {}, $fNode) YIELD rel RETURN $cNode as cn', {
  cNode: cNode,
  fNode: fNode,
  r: 'PREVIOUS'
})
YIELD value
RETURN value.cn as node, apoc.date.toISO8601(value.cn.at) as at;
`;

    const parameters = {
      device: deviceId,
      lng: location.lng,
      lat: location.lat,
    };

    const session = this.driver.session();
    const result = await session.run(cypher, parameters);
    await session.close();

    return Location.fromRecord(result.records?.[0]);
  }

  async onModuleDestroy(): Promise<void> {
    await this.driver.close();
  }
}
