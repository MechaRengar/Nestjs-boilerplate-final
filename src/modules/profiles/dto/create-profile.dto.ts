import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OSInfoDto {
  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  version?: string;
}

export class BrowserInfoDto {
  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  version?: string;
}

export class ScreenResolutionDto {
  @IsNumber()
  width!: number;

  @IsNumber()
  height!: number;
}

export class HardwareDto {
  @IsOptional()
  @IsNumber()
  cpu_cores?: number;

  @IsOptional()
  @IsNumber()
  ram_gb?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ScreenResolutionDto)
  screen_resolution?: ScreenResolutionDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fonts?: string[];
}

export class CanvasDto {
  @IsString()
  mode!: string;
}

export class WebGLDto {
  @IsString()
  mode!: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  renderer?: string;
}

export class AudioContextDto {
  @IsString()
  mode!: string;
}

export class SpeechsDto {
  @IsString()
  mode!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  voices?: string[];
}

export class FingerprintDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CanvasDto)
  canvas?: CanvasDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WebGLDto)
  webgl?: WebGLDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AudioContextDto)
  audiocontext?: AudioContextDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpeechsDto)
  speechs?: SpeechsDto;
}

export class MediaDevicesDto {
  @IsOptional()
  @IsNumber()
  video_inputs?: number;

  @IsOptional()
  @IsNumber()
  audio_inputs?: number;

  @IsOptional()
  @IsNumber()
  audio_outputs?: number;
}

export class ProxyConfigDto {
  @IsString()
  type!: string; // none|http|socks5

  @IsOptional()
  @IsString()
  host?: string;

  @IsOptional()
  @IsNumber()
  port?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  geo?: string;
}

export class NetworkDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ProxyConfigDto)
  proxy?: ProxyConfigDto;

  @IsOptional()
  webrtc?: { mode: string; ip?: string };

  @IsOptional()
  geolocation?: { mode: string; latitude?: number; longitude?: number };

  @IsOptional()
  timezone?: { mode: string; value?: string };
}

export class UserAgentDto {
  @IsString()
  value!: string;

  @IsOptional()
  @IsBoolean()
  auto_generated?: boolean;
}

export class LanguagesDto {
  @IsString()
  mode!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  list?: string[];
}

export class PlatformDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tabs?: string[];
}

export class BookmarkDto {
  @IsOptional()
  @IsString()
  folder?: string;

  @IsString()
  name!: string;

  @IsString()
  url!: string;
}

export class CreateProfileDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => OSInfoDto)
  os!: OSInfoDto;

  @ValidateNested()
  @Type(() => BrowserInfoDto)
  browser!: BrowserInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HardwareDto)
  hardware?: HardwareDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FingerprintDto)
  fingerprint?: FingerprintDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDevicesDto)
  media_devices?: MediaDevicesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NetworkDto)
  network?: NetworkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserAgentDto)
  user_agent?: UserAgentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguagesDto)
  languages?: LanguagesDto;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  plugin_ids?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PlatformDto)
  platform?: PlatformDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BookmarkDto)
  bookmarks?: BookmarkDto[];
}
