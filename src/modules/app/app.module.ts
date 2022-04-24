import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { HandleResponseInterceptor } from '../../interceptors/handle-response.interceptor';
import { AuthorizationGuard } from '../../guards/authorization.guard';
import { LocationModule } from '../location/location.module';
import { DeviceModule } from '../device/device.module';
import { Neo4jModule } from '../neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule, LocationModule, DeviceModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HandleResponseInterceptor,
    },
  ],
})
export class AppModule {}
