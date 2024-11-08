import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  minLength,
} from 'class-validator';

export class UserDTO {
  // email
  @ApiProperty({ example: 'john@gmail.com', description: 'User email' })
  @IsString()
  @IsEmail({}, { message: 'email must be valid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;
  //password
  @ApiProperty({ example: 'john12##', description: 'password' })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6)
  password: string;
}
