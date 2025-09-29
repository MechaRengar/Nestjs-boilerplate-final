import { Module } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { PluginController } from './plugin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Plugin, PluginSchema } from './plugin.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Plugin.name, schema: PluginSchema}])],
  controllers: [PluginController],
  providers: [PluginService],
  exports: [PluginService],
})
export class PluginModule {}