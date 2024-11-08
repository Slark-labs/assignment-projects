import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CourseDTO {
  @IsString()
  @ApiProperty({ example: 'nest js', description: 'course title' })
  @IsNotEmpty({ message: 'title must be required' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'duration', description: '3h' })
  @IsNotEmpty({ message: 'duration must be required' })
  duration: string;

  @IsString()
  @ApiProperty({ example: 'id', description: 'User ids' })
  @IsNotEmpty({ message: 'duration must be required' })
  @IsOptional()
  users: string[];
}
export class UpdateCourseDTO extends CourseDTO {
  @ApiProperty({ example: '01230023432312', description: 'course id' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
export class DeleteUserDTO {
  @IsString()
  @ApiProperty({ example: '01230023432312', description: 'course id' })
  @IsNotEmpty()
  courseId: string;
}
export class EnrollUserDTO extends DeleteUserDTO {
  @IsString()
  @ApiProperty({ example: '01230023432312', description: 'user id' })
  @IsNotEmpty()
  userId: string;
}
