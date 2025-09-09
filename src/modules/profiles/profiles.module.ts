import { Global, Module } from '@nestjs/common';
import { Profile, ProfileSchema } from './profiles.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{name: Profile.name, schema: ProfileSchema}])],
  controllers: [ProfilesController],
  exports: [ProfilesService],
  providers: [ProfilesService],
})
export class ProfileModule {}