import { IsOptional, IsString, IsEmail } from 'class-validator';

export class forgetPasswordDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
