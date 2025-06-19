


import { ApiProperty } from '@nestjs/swagger';
import { VariantResponseDto } from './variant-response.dto';
import { IsNotEmpty } from 'class-validator';

export class ProductResponseDto {

  id: string;

  name: string;

  categoryName: string;


  brand: string;

  imageUrl: string;


  description: string;


  price: number;

  totalStock: number;

  variants: VariantResponseDto[];
}