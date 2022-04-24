import { FastifyRequest } from 'fastify';

import { Device } from '../modules/neo4j/entities/device.entity';
import { PropType } from './prop.type';

export interface RequestLocals {
  device?: Device;
}

export interface RequestRaw extends PropType<FastifyRequest, 'raw'> {
  locals: RequestLocals;
}
