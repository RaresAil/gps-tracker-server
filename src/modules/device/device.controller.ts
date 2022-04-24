import { ApiCreatedResponse, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';

import { RequirePermissions } from '../../decorators/required-permission.decorator';
import { GetDevice } from '../../decorators/device-request.decorator';
import { GetParamDeviceDto } from './dto/get-param-device.dto';
import { ResponseDeviceDto } from './dto/response-device.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Permission } from './interfaces/permission.enum';
import { Device } from '../neo4j/entities/device.entity';
import { DeviceService } from './device.service';
import {
  ApiBase,
  ApiResponseWithSchema,
} from '../../decorators/api-base.decorator';

@Controller({
  path: 'device',
  version: '1',
})
@ApiTags('Device')
@ApiExtraModels(CreateDeviceDto, ResponseDeviceDto)
@RequirePermissions(Permission.Device)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiBase()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse(ApiResponseWithSchema(ResponseDeviceDto))
  create(@Body() createDeviceDto: CreateDeviceDto): Promise<ResponseDeviceDto> {
    return this.deviceService.create(createDeviceDto);
  }

  @Get('/:id')
  @ApiBase()
  @ApiCreatedResponse(ApiResponseWithSchema(ResponseDeviceDto))
  async findById(
    @GetDevice() device: Device,
    @Param()
    { id }: GetParamDeviceDto,
  ): Promise<ResponseDeviceDto> {
    if (device.id === id) {
      return device;
    }

    return this.deviceService.findById(id);
  }
}
