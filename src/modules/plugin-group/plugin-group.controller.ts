import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PluginGroupService } from './plugin-group.service';
import type { CreatePluginGroupDto, UpdatePluginGroupDto } from './dto/plugin-group.dto';

@Controller('plugins-group')
export class PluginGroupController {
  constructor(private readonly pluginService: PluginGroupService) {}

  @Get()
  findAll() {
    return this.pluginService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pluginService.findOne(id);
  }

  @Post()
  create(@Body() createPluginGroupDto: CreatePluginGroupDto) {
    return this.pluginService.create(createPluginGroupDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePluginGroupDto: UpdatePluginGroupDto) {
    return this.pluginService.update(id, updatePluginGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pluginService.remove(id);
  }
}