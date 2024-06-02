import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { SellerApplicationDto } from "./seller-application.dto";
import { UpdateUserDto } from "./update-user.dto";

export class UpdateShopInfoDto extends UpdateUserDto {
  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsOptional()
  user_email: string;

  @IsString()
  phone: string;

  @IsObject()
  @IsOptional()
  shop: {
    shop_name: string;
    shop_address: string;
    shop_logo?: string;
    shop_cover?: string;
    opens_at?: string;
    close_at?: string;
    geetings_message?: string;
    // social_icon?: string;
    // social_link?: string;
    social?: Array<object>;

    seo_title?: string;
    seo_des?: string;
  };

  @IsString()
  status: string;

  @IsString()
  role: string;
}
