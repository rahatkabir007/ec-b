import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../schemas/user.schema";
import { Coupon, CouponSchema } from "../../schemas/coupon.schema";
import { Product, ProductSchema } from "../../schemas/product.schema";
import { Order, OrderSchema } from "../../schemas/order.schema";
import {
  PopularCategory,
  PopularCategorySchema,
} from "../../schemas/popular-category.schema";
import { Wishlist, WishlistSchema } from "../../schemas/wishlist.schema";
import { Category, CategorySchema } from "../../schemas/category.schema";
import { Review, ReviewSchema } from "../../schemas/review.schema";
import { Brand, BrandSchema } from "../../schemas/brand.schema";
import {
  ReportedItem,
  ReportedItemSchema,
} from "../../schemas/reported-item.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: PopularCategory.name, schema: PopularCategorySchema },
      { name: Wishlist.name, schema: WishlistSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: ReportedItem.name, schema: ReportedItemSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
