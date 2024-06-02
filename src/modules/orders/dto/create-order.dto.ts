import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateOrderDto {
  @IsString()
  user_slug: string;

  @IsString()
  @IsOptional()
  user_name: string;

  @IsString()
  @IsOptional()
  user_email: string;

  @IsString()
  @IsOptional()
  user_phone: string;

  @IsString()
  payment_method: string;

  @IsObject()
  address: {
    country: string;
    state: string;
    city: string;
    address: string;
  };

  @IsArray()
  product_list: Array<object>;

  @IsNumber()
  subTotal: number;

  @IsNumber()
  total: number;
}
