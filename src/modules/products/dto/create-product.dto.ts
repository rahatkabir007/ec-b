import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  isBoolean,
} from "class-validator";

export class CreateProductDto {
  // id: string;
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
  @IsOptional()
  status: string;

  @IsArray()
  imageURL: Array<string>;

  @IsOptional()
  offerPrice: number;

  // sellerSlug: string;

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

  @IsNumber()
  @IsOptional()
  rating: number;
}
