import { ApiProperty } from '@nestjs/swagger';
import { AddLocationDto } from './add-location.dto';

export class ResponseLocationDto extends AddLocationDto {
  @ApiProperty({
    readOnly: true,
    format: 'uuid',
  })
  device: string;

  @ApiProperty({
    readOnly: true,
  })
  id: string;

  @ApiProperty({
    readOnly: true,
  })
  at: Date;
}
