import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Unique username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'phone number of the user',
    example: '+9233393312123',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'password for the user',
    example: 'S@12##@EQeqrasd',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'false',
  })
  @IsBoolean()
  @IsOptional()
  fromAdminPanel: boolean = false;
}
