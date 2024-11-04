import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  minLength,
} from 'class-validator';

export class UserDTO {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(2)
  name: string;

  @IsString()
  @IsEmail({}, { message: 'email must be valid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
