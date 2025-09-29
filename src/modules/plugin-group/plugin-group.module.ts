import { Module } from '@nestjs/common';
import { PluginGroupService } from './plugin-group.service';
import { PluginGroupController } from './plugin-group.controller';

@Module({
  controllers: [PluginGroupController],
  providers: [PluginGroupService],
  exports: [PluginGroupService],
})
export class PluginGroupModule {}