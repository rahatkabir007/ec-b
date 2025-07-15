import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { Review, ReviewSchema } from "../../schemas/review.schema";
import { Product, ProductSchema } from "../../schemas/product.schema";
import { User, UserSchema } from "../../schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
