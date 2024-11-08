import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'models/user.model';
import { UserSeedController } from './user.controller';
import { UserSeedService } from './user.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserSeedController],
  providers: [UserSeedService],
})
export class UserSeedModule {}
