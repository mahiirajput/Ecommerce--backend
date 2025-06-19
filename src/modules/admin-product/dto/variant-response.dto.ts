import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class VariantResponseDto {
 
  @IsNotEmpty()
  id: string;


  @IsOptional()
  @IsString()
  size?: string;

 
  @IsOptional()
  @IsString()
  color?: string;


  @IsInt()
  stock: number;
}