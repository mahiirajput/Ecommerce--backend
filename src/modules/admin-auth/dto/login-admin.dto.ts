import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {

  
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  deviceId: string;

  //  @IsNotEmpty()
  //  @IsString()
  // role: string;

  // @IsString()
  // @IsNotEmpty()
  // userId: string;
}
