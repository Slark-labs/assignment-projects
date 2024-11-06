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
  @ApiProperty({ example: 'john', description: 'User name' })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'john@gmail.com', description: 'User email' })
  @IsString()
  @IsEmail({}, { message: 'email must be valid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
