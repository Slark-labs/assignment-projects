import { IsOptional, IsString, IsEmail, IsNotEmpty } from 'class-validator';

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

export class verifyForgetPasswordDto extends forgetPasswordDto {
  @IsString()
  @IsNotEmpty()
  otp: string;
}
