import { Module } from "@nestjs/common";
import { PopularCategoriesService } from "./popular_categories.service";
import { PopularCategoriesController } from "./popular_categories.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  PopularCategory,
  PopularCategorySchema,
} from "../../schemas/popular-category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PopularCategory.name, schema: PopularCategorySchema },
    ]),
  ],
  controllers: [PopularCategoriesController],
  providers: [PopularCategoriesService],
})
export class PopularCategoriesModule { }
