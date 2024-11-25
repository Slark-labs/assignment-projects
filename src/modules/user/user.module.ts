import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register the model
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Export if used in another module
})
export class UserModule {}
