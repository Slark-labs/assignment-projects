import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'models/course.model';
import { User } from 'models/user.model';
import { Model, Types } from 'mongoose';

interface ICourse {
  title: string;
  duration: string;
  users: string[];
}

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createCourse(dto: ICourse) {
    const newCourse = new this.courseModel({
      title: dto.title,
      duration: dto.duration,
    });
    return await newCourse.save();
  }
  async updateCourse(courseId: string, dto: ICourse) {
    return await this.courseModel
      .findByIdAndUpdate(courseId, dto, { new: true })
      .exec();
  }

  async courseExist(identifier: { title?: string; id?: string }) {
    let course = null;
  
    if (identifier.title) {
      course = await this.courseModel.findOne({ title: identifier.title }).exec();
    } else if (identifier.id) {
      course = await this.courseModel.findById(identifier.id).exec();
    }
  
    return !!course;
  } 
  async userExist(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    return !!user; // Returns true if user exists, otherwise false
  }

  async enrollUser(
    courseId: string,
    userId: string,
  ): Promise<{ message: string; data?: Course | string }> {
    try {
      // First, update the course to include the new user
      if (
        !Types.ObjectId.isValid(courseId) ||
        !Types.ObjectId.isValid(userId)
      ) {
        throw new BadRequestException('Invalid courseId or userId');
      }

      const existUser = await this.userModel.findById(userId).exec();
      if (!existUser) {
        return { message: 'User not found', data: 'User not found' };
      }

      const updatedCourse = await this.courseModel
        .findByIdAndUpdate(
          courseId,
          {
            $addToSet: { users: new Types.ObjectId(userId) },
          },
          { new: true },
        )
        .exec();

      if (!updatedCourse) {
        return { message: 'Course not found', data: 'Course not found' };
      }

      // Then, update the user to include the new course
      await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { courseIds: new Types.ObjectId(courseId) },
          },
          { new: true },
        )
        .exec();

      return { message: 'Enrolled successfully', data: updatedCourse };
    } catch (error) {
      throw error;
    }
  }
  async deleteCourse(courseId: string): Promise<boolean> {
    const result = await this.courseModel.findByIdAndDelete(courseId);
    return !!result; // Returns true if a course was deleted, false otherwise
  }
  async allCourses() {
    const all = await this.courseModel.find();
    return all;
  }
}
