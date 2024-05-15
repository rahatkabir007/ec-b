import { Module } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { BlogsController } from "./blogs.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "src/schemas/blog.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
