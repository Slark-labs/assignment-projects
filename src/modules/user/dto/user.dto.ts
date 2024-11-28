import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsObject,
  ValidateIf,
  MinLength,
  MaxLength,
  IsOptional,
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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'StrongPass123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
  @IsNotEmpty()
  confirmPassword: string;

  @ValidateIf((o) => o.password !== o.confirmPassword)
  @IsString({ message: 'Confirm password must match password' })
  confirmPasswordMatch: string;

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

export class DeleteUserDto {
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
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName: string;

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
  @IsOptional()
  currentAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
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
  @IsOptional()
  postalAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}
