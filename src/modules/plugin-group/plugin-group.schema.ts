import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DatabaseSchemaAbstract } from "../../common/abstract-mongo.schema";
import { Types } from "mongoose";
import { DatabaseEntity } from "decorators/database.decorator";

@Schema()
@DatabaseEntity({ collection: 'plugingroup' })
export class PluginGroup extends DatabaseSchemaAbstract {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by!: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Plugin' })
  plugins!: Types.ObjectId[];

  @Prop({ default: false })
  global!: boolean;

  @Prop({ default: () => Math.floor(Date.now() / 1000) })
  create_at!: number;

  @Prop({ default: () => Math.floor(Date.now() / 1000) })
  update_at!: number;
}

export const PluginGroupGroupSchema = SchemaFactory.createForClass(PluginGroup);