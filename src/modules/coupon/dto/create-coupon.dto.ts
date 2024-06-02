import { IsObject } from "class-validator";

export class CreateCouponDto {
  name: string;
  code: string;
  // discount: number;
  items_number: number;
  // apply_qty: number;
  expired_date: string;
  status: string;
  action: string;
  minimum_purchase: number;

  @IsObject()
  discount: {
    role: string;
    value: number;
  };
}
