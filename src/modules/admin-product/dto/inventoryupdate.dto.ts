import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class VariantStockUpdateDto {
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsNumber()
  @Min(0)
  stock: number;
  
  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class InventoryUpdateAdminDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantStockUpdateDto)
  variants: VariantStockUpdateDto[];
}
