import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetParamDeviceDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  id: string;
}
