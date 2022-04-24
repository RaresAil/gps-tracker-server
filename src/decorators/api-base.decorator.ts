import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiResponseModel = (
  message: string,
  code: number,
  description?: string,
): ApiResponseOptions => ({
  description: description || message,
  status: code,
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: code,
      },
      message: {
        type: 'string',
        example: message,
      },
    },
  },
});

export const ApiResponseWithSchema = <T extends Type>(
  model: T,
  isArray = false,
): ApiResponseOptions => ({
  description: 'Success Operation',
  schema: isArray
    ? {
        type: 'array',
        items: {
          $ref: getSchemaPath(model),
        },
      }
    : {
        $ref: getSchemaPath(model),
      },
});

export const ApiBase = (): ReturnType<typeof applyDecorators> =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: HttpStatus.BAD_REQUEST,
          },
          message: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
        },
      },
    }),
    ApiNotFoundResponse(ApiResponseModel('Not Found', HttpStatus.NOT_FOUND)),
    ApiUnauthorizedResponse(
      ApiResponseModel('Unauthorized', HttpStatus.UNAUTHORIZED),
    ),
    ApiForbiddenResponse(ApiResponseModel('Forbidden', HttpStatus.FORBIDDEN)),
  );
