import { Module } from "@nestjs/common";
import { SubCategoriesService } from "./sub-categories.service";
import { SubCategoriesController } from "./sub-categories.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SubCategories,
  SubCategoriesSchema,
} from "../../schemas/sub-category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategories.name, schema: SubCategoriesSchema },
    ]),
  ],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule { }
