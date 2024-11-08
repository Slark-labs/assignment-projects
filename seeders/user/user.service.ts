import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seedUser() {
    const data = [
      { name: 'John', email: 'john@gmail.com', password: 'hashed-password' },
      { name: 'Sam', email: 'sam@gmail.com', password: 'hashed-password' },
    ];
    const result = await this.userModel.insertMany(data);
    return result;
  }
  async existSeedUser() {
    const count = await this.userModel.countDocuments();
    if (count > 0) {
      return { message: 'db already seeded' };
    }
  }
}
