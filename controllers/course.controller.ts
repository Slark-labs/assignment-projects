import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  CourseDTO,
  DeleteUserDTO,
  EnrollUserDTO,
  UpdateCourseDTO,
} from 'dto/course.dto';
import { response, Response } from 'express';
import { AuthGuard } from 'guards/auth.guard';
import { CourseService } from 'services/course.service';

@ApiBearerAuth()
@Controller('api/course')
export class CourseController {
  constructor(private course: CourseService) {}
  @Get()
  @ApiNotFoundResponse({ description: 'No course found' })
  @ApiFoundResponse({ description: 'Course found' })
  @UseGuards(new AuthGuard())
  async allCourse(@Res() response: Response) {
    const allCourses = await this.course.allCourses();
    if (!allCourses) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No course found' });
    }
    return response
      .status(HttpStatus.FOUND)
      .json({ message: 'Courses found successfully', data: allCourses });
  }
  @Post()
  @ApiConflictResponse({
    description: 'Course with the given title already exists',
  })
  @ApiCreatedResponse({ description: 'Course created successfully' })
  @UseGuards(new AuthGuard())
  async registerCourse(@Body() dto: CourseDTO, @Res() response: Response) {
    const existCourse = await this.course.courseExist({ title: dto.title });
    if (existCourse) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'Course with the given title already exists',
      });
    }
    const newCourse = await this.course.createCourse(dto);
    return response.status(HttpStatus.CREATED).json({
      message: 'success',
      data: newCourse,
    });
  }
  @Post('update')
  @UseGuards(new AuthGuard())
  @ApiNotFoundResponse({ description: 'No course found' })
  @ApiOkResponse({ description: 'Course updated successfully' })
  async updateCourse(@Body() dto: UpdateCourseDTO, @Res() response: Response) {
    const existCourse = await this.course.courseExist({ id: dto.courseId });
    if (!existCourse) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'Course not found',
      });
    }
    const updatedCourse = await this.course.updateCourse(dto.courseId, dto);
    return response.status(HttpStatus.OK).json({
      message: 'success',
      data: updatedCourse,
    });
  }
  @Post('enroll')
  @UseGuards(new AuthGuard())
  @ApiNotFoundResponse({ description: 'No course found' })
  @ApiOkResponse({ description: 'Course enrolled successfully' })
  async enrollUser(@Body() dto: EnrollUserDTO, @Res() response: Response) {
    // Destructure courseId and userId from body
    const enrollUser = await this.course.enrollUser(dto.courseId, dto.userId);

    if (!enrollUser) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No course found' });
    }

    return response.status(HttpStatus.OK).json(enrollUser);
  }
  @Delete()
  @UseGuards(new AuthGuard())
  @ApiNotFoundResponse({ description: 'No course found' })
  @ApiOkResponse({ description: 'Course enrolled successfully' })
  async deleteCourse(@Body() dto: DeleteUserDTO, @Res() response: Response) {
    const deleteResult = await this.course.deleteCourse(dto.courseId);

    if (!deleteResult) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No course found' });
    }

    return response
      .status(HttpStatus.OK)
      .json({ message: 'Course deleted successfully' });
  }
}
