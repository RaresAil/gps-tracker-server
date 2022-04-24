import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { RequestRaw } from '../interface/request-locals.interface';

export const GetDevice = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const { locals } = request.raw as RequestRaw;
    return locals?.device;
  },
);
