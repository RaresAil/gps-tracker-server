import { Module } from '@nestjs/common';

import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Neo4jModule } from '../neo4j/neo4j.module';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService],
  imports: [Neo4jModule],
})
export class DeviceModule {}
