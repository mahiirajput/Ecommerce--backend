

import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  parentCategoryId?: string;
}
