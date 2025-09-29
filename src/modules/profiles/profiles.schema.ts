import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseEntity } from '../../decorators/database.decorator';
import { DatabaseSchemaAbstract } from '../../common/abstract-mongo.schema';
import { Types } from 'mongoose';

@Schema({ _id: false })
class OS {
  @Prop({ required: true })
  type!: string; // windows, mac, linux, android, ios

  @Prop()
  version!: string;
}

@Schema({ _id: false })
class Browser {
  @Prop({ required: true })
  type!: string; // chrome, firefox

  @Prop()
  version!: string;
}

@Schema({ _id: false })
class Hardware {
  @Prop()
  cpu_cores!: number;

  @Prop()
  ram_gb!: number;

  @Prop({ type: { width: Number, height: Number } })
  screen_resolution!: { width: number; height: number };

  @Prop([String])
  fonts!: string[];
}

@Schema({ _id: false })
class Fingerprint {
  @Prop({ type: { mode: String } })
  canvas!: { mode: string };

  @Prop({ type: { mode: String, vendor: String, renderer: String } })
  webgl!: { mode: string; vendor?: string; renderer?: string };

  @Prop({ type: { mode: String } })
  audiocontext!: { mode: string };

  @Prop({ type: { mode: String, voices: [String] } })
  speechs!: { mode: string; voices?: string[] };
}

@Schema({ _id: false })
class MediaDevices {
  @Prop()
  video_inputs!: number;

  @Prop()
  audio_inputs!: number;

  @Prop()
  audio_outputs!: number;
}

@Schema({ _id: false })
class ProxyConfig {
  @Prop()
  type!: string; // none|http|socks5

  @Prop()
  host?: string;

  @Prop()
  port?: number;

  @Prop()
  username?: string;

  @Prop()
  password?: string;

  @Prop()
  geo?: string;
}

@Schema({ _id: false })
class Network {
  @Prop({ type: ProxyConfig })
  proxy!: ProxyConfig;

  @Prop({ type: { mode: String, ip: String } })
  webrtc!: { mode: string; ip?: string };

  @Prop({ type: { mode: String, latitude: Number, longitude: Number } })
  geolocation!: { mode: string; latitude?: number; longitude?: number };

  @Prop({ type: { mode: String, value: String } })
  timezone!: { mode: string; value?: string };
}

@Schema({ _id: false })
class UserAgent {
  @Prop()
  value!: string;

  @Prop({ default: true })
  auto_generated!: boolean;
}

@Schema({ _id: false })
class Languages {
  @Prop()
  mode!: string; // ip|custom

  @Prop([String])
  list!: string[];
}

@Schema({ _id: false })
class Platform {
  @Prop()
  name!: string;

  @Prop([String])
  tabs!: string[];
}

@Schema({ _id: false })
class Bookmark {
  @Prop()
  folder?: string;

  @Prop()
  name!: string;

  @Prop()
  url!: string;
}

@Schema()
@DatabaseEntity({ collection: 'profiles' })
export class Profile extends DatabaseSchemaAbstract {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ type: OS })
  os!: OS;

  @Prop({ type: Browser })
  browser!: Browser;

  @Prop({ type: Hardware })
  hardware!: Hardware;

  @Prop({ type: Fingerprint })
  fingerprint!: Fingerprint;

  @Prop({ type: MediaDevices })
  media_devices!: MediaDevices;

  @Prop({ type: Network })
  network!: Network;

  @Prop({ type: UserAgent })
  user_agent!: UserAgent;

  @Prop({ type: Languages })
  languages!: Languages;

  @Prop({ type: Types.ObjectId, ref: 'plugingroup' })
  plugin_group!: Types.ObjectId;

  @Prop({ type: Platform })
  platform!: Platform;

  @Prop({ type: [Bookmark] })
  bookmarks!: Bookmark[];
}

// Tạo schema từ class Profile
export const ProfileSchema = SchemaFactory.createForClass(Profile);