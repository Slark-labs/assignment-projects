import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  fromAdminPanel: boolean = false;
}
