import {
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { RequirePermissions } from '../../decorators/required-permission.decorator';
import { GetParamLocationDeviceDto } from './dto/get-param-location-device.dto';
import { GetDevice } from '../../decorators/device-request.decorator';
import { GetQueryLocationDto } from './dto/get-query-location.dto';
import { ResponseLocationDto } from './dto/response-location.dto';
import { Permission } from '../device/interfaces/permission.enum';
import { Device } from '../neo4j/entities/device.entity';
import { AddLocationDto } from './dto/add-location.dto';
import { LocationService } from './location.service';
import {
  ApiBase,
  ApiResponseWithSchema,
} from '../../decorators/api-base.decorator';

@Controller({
  path: 'location',
  version: '1',
})
@ApiBearerAuth()
@ApiTags('Location')
@ApiExtraModels(AddLocationDto, ResponseLocationDto, GetQueryLocationDto)
@RequirePermissions(Permission.Location)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiBase()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse(ApiResponseWithSchema(ResponseLocationDto))
  create(
    @GetDevice() device: Device,
    @Body() createLocationDto: AddLocationDto,
  ): Promise<ResponseLocationDto> {
    return this.locationService.create(createLocationDto, device.id);
  }

  @Get()
  @ApiBase()
  @ApiOkResponse(ApiResponseWithSchema(ResponseLocationDto, true))
  findAll(
    @GetDevice() device: Device,
    @Query() { limit }: GetQueryLocationDto,
  ): Promise<ResponseLocationDto[]> {
    return this.locationService.findAll(device.id, limit);
  }

  @Get('/:id')
  @ApiBase()
  @ApiOkResponse(ApiResponseWithSchema(ResponseLocationDto, true))
  @RequirePermissions(Permission.Location, Permission.Device)
  findAllForDevice(
    @Param() { id }: GetParamLocationDeviceDto,
    @Query() { limit }: GetQueryLocationDto,
  ): Promise<ResponseLocationDto[]> {
    return this.locationService.findAll(id, limit);
  }
}
