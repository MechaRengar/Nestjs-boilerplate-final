import { Global, Module } from '@nestjs/common';
import { Profile, ProfileSchema } from './profiles.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{name: Profile.name, schema: ProfileSchema}])],
  // exports: [ProfileService],
  // providers: [ProfileService],
})
export class ProfileModule {}