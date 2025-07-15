import { Module } from "@nestjs/common";
import { BlogCategoryService } from "./blog-category.service";
import { BlogCategoryController } from "./blog-category.controller";
import { BlogCategory } from "../../schemas/blog-category.schema";
import { BlogCategorySchema } from "../../schemas/blog-category.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "../../schemas/blog.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogCategory.name, schema: BlogCategorySchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
})
export class BlogCategoryModule { }
