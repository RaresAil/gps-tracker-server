import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetParamLocationDeviceDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  id: string;
}
