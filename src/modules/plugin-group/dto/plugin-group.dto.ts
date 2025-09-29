import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class PluginGroupDto {
  @ApiProperty({ description: 'Name of the plugin group' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Description of the plugin group', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'List of plugin IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  plugins?: string[];

  @ApiProperty({ description: 'Is the plugin group active?', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreatePluginGroupDto extends PluginGroupDto {}

export class UpdatePluginGroupDto {
  @ApiProperty({ description: 'Name of the plugin group', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Description of the plugin group', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'List of plugin IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  plugins?: string[];

  @ApiProperty({ description: 'Is the plugin group active?', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}