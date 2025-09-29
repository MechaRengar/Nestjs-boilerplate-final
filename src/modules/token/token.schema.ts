import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseEntity } from '../../decorators/database.decorator';
import { DatabaseSchemaAbstract } from '../../common/abstract-mongo.schema';

export enum TokenType {
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
}

class ExtraInfo {
  @Prop({ required: true })
  deviceFingerprint!: string;

  @Prop({ required: true })
  deviceOs!: string;

  @Prop({ type: [String], required: true })
  deviceSupportedAbis!: string[];

  @Prop({ required: true })
  deviceModel!: string;

  @Prop({ required: true })
  deviceIsRoot!: number;

  @Prop({ required: true })
  deviceHardware!: string;

  @Prop({ required: true })
  deviceManufacture!: string;

  @Prop({ required: true })
  deviceFreeMemory!: number;

  @Prop({ required: true })
  osBuildNumber!: string;

  @Prop({ required: true })
  osIncremental!: string;

  @Prop({ required: true })
  osSecurityPath!: string;

  @Prop({ required: true })
  appVersion!: string;

  @Prop({ required: true })
  appBundleId!: string;

  @Prop({ required: true })
  isEmulator!: number;

  @Prop({ required: true })
  isTablet!: number;
}

class DeviceInfo {
  @Prop({ required: true })
  ip!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  countryCode!: string;

  @Prop({ required: true })
  deviceId!: string;

  @Prop({ required: true })
  deviceType!: string;

  @Prop({ required: true })
  deviceOs!: string;

  @Prop({ type: ExtraInfo, required: true })
  extraInfo!: ExtraInfo;
}

@Schema()
@DatabaseEntity({ collection: 'tokens' })
export class Token extends DatabaseSchemaAbstract {
  @Prop({ required: true, index: true })
  token!: string;

  @Prop({ type: String, required: false })
  oldTokenId?: string;

  @Prop({ required: true })
  accountId!: number;

  @Prop({ required: false, index: true })
  deviceId?: string;

  @Prop({ required: false })
  platform?: string;

  @Prop({ required: false })
  deviceDes?: string;

  @Prop({ required: true, enum: TokenType })
  type!: TokenType;

  @Prop({ required: true })
  expires!: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: DeviceInfo, required: true })
  deviceInfo!: DeviceInfo;
}

// Tạo schema từ class Token
export const TokenSchema = SchemaFactory.createForClass(Token);