import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';


export class SignupAdminDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(224)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}