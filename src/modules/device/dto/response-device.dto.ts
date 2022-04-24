import { ApiProperty } from '@nestjs/swagger';

import { CreateDeviceDto } from './create-device.dto';

export class ResponseDeviceDto extends CreateDeviceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  createdAt: Date;
}
