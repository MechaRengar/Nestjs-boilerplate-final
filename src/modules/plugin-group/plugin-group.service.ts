import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PluginGroup } from './plugin-group.schema';
import type { Model } from 'mongoose';

@Injectable()
export class PluginGroupService {
  constructor(
    @InjectModel('plugingroup') private readonly pluginGroupModel: Model<PluginGroup>,
  ) {}

  async findAll() {
    const listPluginGroup = await this.pluginGroupModel.find();
    return listPluginGroup;
  }

  async findOne(id: string) {
    // Logic to retrieve a single plugin group by ID
    return { id };
  }

  async create(createPluginGroupDto: any) {
    // Logic to create a new plugin group
    return createPluginGroupDto;
  }

  async update(id: string, updatePluginGroupDto: any) {
    // Logic to update an existing plugin group by ID
    return { id, ...updatePluginGroupDto };
  }

  async remove(id: string) {
    // Logic to delete a plugin group by ID
    return { id, deleted: true };
  }
}