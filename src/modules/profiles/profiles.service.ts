import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile } from './profiles.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { Plugin } from '../../modules/plugin/plugin.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Profile.name) private pluginModel: Model<Plugin>,
  ) {}

async create(createProfileDto: CreateProfileDto, userId: string): Promise<Profile> {
    // 🔍 Validate plugin_ids (nếu có)
    if (createProfileDto.plugin_ids?.length) {
      const count = await this.pluginModel.countDocuments({
        _id: { $in: createProfileDto.plugin_ids },
        created_by: new Types.ObjectId(userId),
      });
      if (count !== createProfileDto.plugin_ids.length) {
        throw new NotFoundException('Some plugins not found or not owned by user');
      }
    }

    const createdProfile = new this.profileModel({
      ...createProfileDto,
      created_by: new Types.ObjectId(userId),
    });

    return createdProfile.save();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileModel.findById(id).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const updatedProfile = await this.profileModel.findByIdAndUpdate(
      id,
      updateProfileDto,
      { new: true },
    ).exec();
    if (!updatedProfile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return updatedProfile;
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
  }
}