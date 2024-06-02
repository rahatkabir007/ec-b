import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@Controller("blogs")
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }
  @Get("/for-admin")
  findAllForAdmin() {
    return this.blogsService.findAllForAdmin();
  }

  @Get("/category")
  findFilteredBlogs(
    @Query()
    query: {
      category: string;
    }
  ) {
    return this.blogsService.findFilteredBlogs(query);
  }

  // @Get()
  // findAll(@Query() query: { user_slug: string }) {
  //   return this.cartService.findAll(query);
  // }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    console.log(slug);
    return this.blogsService.findOne(slug);
  }

  @Patch(":slug")
  update(@Param("slug") slug: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(slug, updateBlogDto);
  }

  @Patch("/edit-status/:slug")
  updateStatus(
    @Param("slug") slug: string,
    @Body() updateBlogDto: UpdateBlogDto
  ) {
    return this.blogsService.update(slug, updateBlogDto);
  }

  @Delete(":slug")
  delete(@Param("slug") slug: string) {
    return this.blogsService.delete(slug);
  }
}
