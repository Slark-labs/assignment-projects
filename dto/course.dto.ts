import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CourseDTO {
  @IsString()
  @IsNotEmpty({ message: 'title must be required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'duration must be required' })
  duration: string;

  @IsString()
  @IsNotEmpty({ message: 'duration must be required' })
  @IsOptional()
  users: string[];
}
export class UpdateCourseDTO extends CourseDTO {
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
export class DeleteUserDTO {
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
export class EnrollUserDTO extends DeleteUserDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
