import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReviewDto {
  @IsString()
  user_slug: string;

  @IsString()
  order_slug: string;

  @IsString()
  product_slug: string;

  @IsString()
  @IsOptional()
  seller_slug: string;

  @IsString()
  name: string;

  @IsString()
  message: string;

  @IsNumber()
  rating: number;

  @IsString()
  status: string;
}
