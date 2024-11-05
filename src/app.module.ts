import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'models/user.model';
import { LoginUser, RegisterUser } from 'services/user.service';
import { UserController } from 'controllers/user.controller';
import { Course, courseSchema } from 'models/course.model';
import { CourseService } from 'services/course.service';
import { CourseController } from 'controllers/course.controller';
import { Token } from 'services/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Course', schema: courseSchema },
    ]),
    MongooseModule.forRoot(`mongodb://127.0.0.1:27017/courses`),
  ],
  controllers: [AppController, UserController, CourseController],
  providers: [AppService, RegisterUser, CourseService, Token, LoginUser],
  exports: [RegisterUser, Token],
})
export class AppModule {}
