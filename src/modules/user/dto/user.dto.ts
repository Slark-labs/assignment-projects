import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsObject,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'StrongPass123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'StrongPass123',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    description: "Role of the user ('visitor', 'admin', 'user')",
    example: 'user',
  })
  @IsEnum(['visitor', 'admin', 'user'])
  @IsNotEmpty()
  role: 'visitor' | 'admin' | 'user';

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Current address of the user',
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
  })
  @IsObject()
  currentAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @ApiProperty({
    description: 'Postal address of the user',
    example: {
      street: '456 Elm St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA',
    },
  })
  @IsObject()
  postalAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
