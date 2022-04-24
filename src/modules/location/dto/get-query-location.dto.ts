import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetQueryLocationDto {
  @Min(1)
  @IsInt()
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value.toString(), 10))
  @ApiProperty({
    default: 25,
    required: false,
    maximum: 100,
    minimum: 1,
  })
  limit: number;
}
