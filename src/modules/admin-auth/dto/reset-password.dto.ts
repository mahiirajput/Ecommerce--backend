import {  IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
 @IsNotEmpty()
 @IsString()
 token :string
  @IsNotEmpty()
  @IsString()
  @Length(6,6)
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}