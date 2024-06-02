import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BlogCategoryService } from "./blog-category.service";
import { CreateBlogCategoryDto } from "./dto/create-blog-category.dto";
import { UpdateBlogCategoryDto } from "./dto/update-blog-category.dto";

@Controller("blogcategories")
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.blogCategoryService.create(createBlogCategoryDto);
  }

  @Get()
  findAll() {
    return this.blogCategoryService.findAll();
  }
  @Get("/for-blog")
  findAllForBlog() {
    return this.blogCategoryService.findAllForBlog();
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.blogCategoryService.findOne(+id);
  // }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    console.log(slug);
    return this.blogCategoryService.findOne(slug);
  }

  @Patch(":slug")
  update(
    @Param("slug") slug: string,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto
  ) {
    return this.blogCategoryService.update(slug, updateBlogCategoryDto);
  }
  
  // status active/inactive
  @Patch("/edit-status/:slug")
  updateStatus(
    @Param("slug") slug: string,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto
  ) {
    return this.blogCategoryService.update(slug, updateBlogCategoryDto);
  }

  @Delete(":slug")
  delete(@Param("slug") slug: string) {
    return this.blogCategoryService.delete(slug);
  }
}
