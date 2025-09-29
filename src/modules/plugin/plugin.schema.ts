import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DatabaseEntity } from "../../decorators/database.decorator";
import { Types } from "mongoose";

@Schema()
@DatabaseEntity({ collection: 'plugin' })
export class Plugin {
  @Prop({ required: true })
  name!: string;

  @Prop()
  version?: string;

  @Prop()
  path?: string; // nơi lưu plugin (file path, url, hoặc storage key)

  @Prop({ type: Types.ObjectId, ref: 'plugingroup' })
  group_id?: Types.ObjectId;
}

export const PluginSchema = SchemaFactory.createForClass(Plugin);