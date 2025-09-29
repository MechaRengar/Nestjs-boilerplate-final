import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  readonly success: boolean;

  @ApiPropertyOptional()
  readonly data?: unknown;

  @ApiPropertyOptional()
  readonly message?: string;

  @ApiPropertyOptional()
  readonly total?: number;

  @ApiPropertyOptional()
  readonly totalCount?: number;

  constructor(
    success: boolean,
    data: unknown,
    message?: string,
    total?: number,
    totalCount?: number,
  ) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.total = total;
    this.totalCount = totalCount;
  }
}
