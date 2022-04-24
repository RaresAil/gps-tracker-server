import { ArrayUnique, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../interfaces/permission.enum';

export class CreateDeviceDto {
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: Permission,
    isArray: true,
  })
  @ArrayUnique()
  @IsEnum(Permission, {
    each: true,
  })
  permissions: Permission[];
}
