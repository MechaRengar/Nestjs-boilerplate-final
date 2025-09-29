import { Injectable } from '@nestjs/common';
import { Plugin } from './plugin.schema';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

@Injectable()
export class PluginService {
    constructor(
    @InjectModel(Plugin.name)
    private readonly pluginModel: Model<Plugin>,
  ){}
  async getAllPlugins(id: number) {
    const list_plugins = await this.pluginModel.find({accountId: id}).lean();

    return list_plugins;
  }
}