import { Controller, Post } from '@nestjs/common';
import { UserSeedService } from './user.service';

@Controller('seed')
export class UserSeedController {
  constructor(private readonly userService: UserSeedService) {}

  @Post()
  async seed() {
    const existSeeder = await this.userService.existSeedUser();
    if (existSeeder) {
      return { message: 'seeder already exist' };
    }
    const data = await this.userService.seedUser();
    return { message: 'seeded successfully', data: data };
  }
}
 