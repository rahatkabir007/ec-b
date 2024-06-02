import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { Query, Request, UseGuards } from "@nestjs/common/decorators";
import { SearchSortDto } from "src/utils/all-queries.dto";
import { CouponService } from "./coupon.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("coupon")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get("/admin")
  // @UseGuards(AuthGuard("jwt"))
  async findAllAdminCoupons(
    @Query() query: SearchSortDto,
    @Request() req: Request
  ) {
    console.log(req);
    return await this.couponService.findAllAdminCoupons(query);
  }

  // @Get()
  // findAll() {
  //   return this.couponService.findAll();
  // }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.couponService.findOne(slug);
  }

  @Get("/apply/couponCode")
  findOneCoupon(@Query() query: { code: string }) {
    console.log(query);
    return this.couponService.findOneCoupon(query);
  }

  @Patch(":slug")
  update(
    @Param("slug") slug: string,
    @Body() updateCouponDto: UpdateCouponDto
  ) {
    return this.couponService.update(slug, updateCouponDto);
  }

  @Delete(":slug")
  delete(@Param("slug") slug: string) {
    return this.couponService.delete(slug);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.couponService.remove(+id);
  // }
}
