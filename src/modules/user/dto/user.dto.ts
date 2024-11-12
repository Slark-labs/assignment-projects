import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsObject,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsEnum(['visitor', 'admin', 'user'])
  @IsNotEmpty()
  role: 'visitor' | 'admin' | 'user';

  @IsString()
  phone: string;

  @IsObject()
  currentAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @IsObject()
  postalAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
