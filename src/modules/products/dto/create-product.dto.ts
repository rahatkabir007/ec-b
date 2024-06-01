import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  productName: string;

  @IsString()
  catSlug: string;

  @IsOptional()
  @IsString()
  subCatSlug: string;

  @IsOptional()
  @IsString()
  brandSlug: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  imageURL: string;

  @IsOptional()
  offerPrice: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  stock: number;

  @IsString()
  seoTitle: string;

  @IsString()
  seoDescription: string;

  @IsOptional()
  @IsBoolean()
  isTopProduct: boolean;

  @IsOptional()
  @IsBoolean()
  isNewArrival: boolean;

  @IsOptional()
  @IsBoolean()
  isBestProduct: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;

  @IsOptional()
  @IsBoolean()
  isPopular: boolean;

  @IsString()
  addedBy: string;

  @IsString()
  @IsOptional()
  seller_slug: string;
}
