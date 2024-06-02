import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Coupon, CouponDocument } from "src/schemas/coupon.schema";
import { UtilSlug } from "src/utils/UtilSlug";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>
  ) {}
  // create(createCouponDto: CreateCouponDto) {
  //   return "This action adds a new coupon";
  // }

  async create(createCouponDto: CreateCouponDto): Promise<object> {
    createCouponDto["slug"] = UtilSlug.getUniqueId(createCouponDto.name);

    const result = await new this.couponModel(createCouponDto).save();
    if (result) {
      return { message: "Success" };
    }
  }

  async findAllAdminCoupons(query: any) {
    const allCouponsData = await this.couponModel
      .find({
        name: new RegExp(query.search, "i"),
      })
      .sort({ [query.sortBy]: query.sortType });

    return allCouponsData;
  }

  // findAll() {
  //   return `This action returns all coupon`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} coupon`;
  // }

  async findOne(slug: string) {
    const couponFind = await this.couponModel.findOne({ slug });
    return couponFind;
  }

  // coupon apply------
  async findOneCoupon(query: { code: string }) {
    console.log(query);
    return await this.couponModel.findOne({ code: query.code });
  }
  // ---------------
  async update(slug: string, updateCouponDto: UpdateCouponDto) {
    return await this.couponModel.findOneAndUpdate({ slug }, updateCouponDto, {
      new: true,
    });
  }

  async delete(slug: string): Promise<Coupon> {
    return await this.couponModel.findOneAndDelete({ slug }).exec();
  }

  // remove(id: number) {
  //   return `This action removes a #${id} coupon`;
  // }
}
