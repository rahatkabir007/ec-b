import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BlogCommentsService } from "./blog_comments.service";
import { CreateBlogCommentDto } from "./dto/create-blog_comment.dto";
import { UpdateBlogCommentDto } from "./dto/update-blog_comment.dto";

@Controller("blog-comments")
export class BlogCommentsController {
  constructor(private readonly blogCommentsService: BlogCommentsService) {}

  @Post()
  create(@Body() createBlogCommentDto: CreateBlogCommentDto) {
    return this.blogCommentsService.create(createBlogCommentDto);
  }

  @Get("/single-blog/:slug")
  findBlogComments(@Param("slug") slug: string) {
    return this.blogCommentsService.findBlogComments(slug);
  }

  @Get()
  findAll() {
    return this.blogCommentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.blogCommentsService.findOne(+id);
  }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateBlogCommentDto: UpdateBlogCommentDto
  // ) {
  //   return this.blogCommentsService.update(+id, updateBlogCommentDto);
  // }

  // status active/inactive
  @Patch("/edit-status/:slug")
  updateStatus(
    @Param("slug") slug: string,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto
  ) {
    return this.blogCommentsService.updateStatus(slug, updateBlogCommentDto);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.blogCommentsService.remove(+id);
  // }

  @Delete(":slug")
  delete(@Param("slug") slug: string) {
    return this.blogCommentsService.delete(slug);
  }
}
