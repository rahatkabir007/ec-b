import { Module } from "@nestjs/common";
import { FeaturedCategoriesService } from "./featured_categories.service";
import { FeaturedCategoriesController } from "./featured_categories.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  FeaturedCategory,
  FeaturedCategorySchema,
} from "../../schemas/featured-category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeaturedCategory.name, schema: FeaturedCategorySchema },
    ]),
  ],
  controllers: [FeaturedCategoriesController],
  providers: [FeaturedCategoriesService],
})
export class FeaturedCategoriesModule { }
