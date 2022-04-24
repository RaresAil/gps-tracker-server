import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { REQUIRE_PERMISSION } from '../decorators/required-permission.decorator';
import { Permission } from '../modules/device/interfaces/permission.enum';
import { RequestRaw } from '../interface/request-locals.interface';
import { Device } from '../modules/neo4j/entities/device.entity';
import { Neo4jService } from '../modules/neo4j/neo4j.service';
import { Payload, Token } from './interfaces/token.interface';
import { HMACHelper } from '../helpers/hmac.helper';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const raw = request.raw as RequestRaw;
    raw.locals = raw.locals || {};

    const token = this.getToken(request);
    if (!token?.payload?.sub) {
      return false;
    }

    const device = await this.getDeviceFromToken(token);
    if (!device) {
      return false;
    }

    if (!this.verifySignature(token, device)) {
      return false;
    }

    if (!this.verifyPermissions(device.permissions, context)) {
      return false;
    }

    raw.locals.device = {
      ...device,
    };

    return true;
  }

  private getToken(request: FastifyRequest): Token | null {
    try {
      const authorization = request.headers?.authorization?.split(' ') ?? [];
      const token = authorization[1];

      if (authorization[0] !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }

      const [signature, bPayload] = token.split('.');

      const payload: Payload = JSON.parse(
        Buffer.from(bPayload, 'base64url').toString('utf8'),
      );

      if (
        !Number.isInteger(payload.exp) ||
        payload.exp <= new Date().getTime()
      ) {
        return null;
      }

      return {
        signature: Buffer.from(signature, 'base64url').toString('hex'),
        payload,
      };
    } catch {
      return null;
    }
  }

  private verifySignature(
    { signature, payload }: Token,
    device: Device,
  ): boolean {
    return (
      !!signature &&
      HMACHelper.generateSign(device.key, device.id, payload.exp) === signature
    );
  }

  private verifyPermissions(
    devicePermissions: Permission[],
    context: ExecutionContext,
  ): boolean {
    const routePermissions = this.reflector.get<Permission[]>(
      REQUIRE_PERMISSION,
      context.getHandler(),
    );

    const controllerPermissions = this.reflector.get<Permission[]>(
      REQUIRE_PERMISSION,
      context.getClass(),
    );

    const requiredPermissions = routePermissions || controllerPermissions;

    if (Array.isArray(requiredPermissions) && requiredPermissions?.length) {
      const hasPermission = requiredPermissions.reduce(
        (lastCheck, permission) => {
          if (!devicePermissions.includes(permission)) {
            return false;
          }

          return lastCheck;
        },
        true,
      );

      return hasPermission;
    }

    return false;
  }

  private async getDeviceFromToken(token: Token): Promise<Device | null> {
    const device = await this.neo4jService.getDevice(token.payload.sub);
    if (
      !device?.id ||
      !Array.isArray(device?.permissions) ||
      !device?.permissions?.length
    ) {
      return null;
    }

    return device;
  }
}
