import { Module } from '@nestjs/common';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Neo4jModule } from '../neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
