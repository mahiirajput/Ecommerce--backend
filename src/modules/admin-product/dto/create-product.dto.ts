


 
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class VariantDto {
  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsNumber()
  stock: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  subCategory: string;
  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  brand: string;

  @IsString()
  imageUrl: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;


  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}