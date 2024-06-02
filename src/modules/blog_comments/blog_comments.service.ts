import {
  BlogComment,
  BlogCommentDocument,
} from "./../../schemas/blog_comment.schema";
import { Injectable } from "@nestjs/common";
import { CreateBlogCommentDto } from "./dto/create-blog_comment.dto";
import { UpdateBlogCommentDto } from "./dto/update-blog_comment.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class BlogCommentsService {
  constructor(
    @InjectModel(BlogComment.name)
    private readonly blogCommentModel: Model<BlogCommentDocument>
  ) {}

  async create(createBlogCommentDto: CreateBlogCommentDto) {
    createBlogCommentDto["slug"] = UtilSlug.getUniqueId(
      createBlogCommentDto.blogSlug
    );
    return await this.blogCommentModel.create(createBlogCommentDto);
  }

  async findBlogComments(slug: string) {
    return await this.blogCommentModel
      .find({ blogSlug: slug, status: "active" })
      .sort({ createdAt: -1 });
  }

  // findAll() {
  //   return `This action returns all blogComments`;
  // }
  async findAll(): Promise<BlogComment[]> {
    return await this.blogCommentModel.find({}).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} blogComment`;
  }

  // update(id: number, updateBlogCommentDto: UpdateBlogCommentDto) {
  //   return `This action updates a #${id} blogComment`;
  // }

  //-------status update ---------------
  async updateStatus(
    slug: string,
    updateBlogCommentDto: UpdateBlogCommentDto
  ): Promise<any> {
    console.log(updateBlogCommentDto);
    const updatedStatus = await this.blogCommentModel.findOneAndUpdate(
      { slug: slug },
      updateBlogCommentDto,
      {
        new: true,
      }
    );
    console.log(updatedStatus);
    return updatedStatus;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} blogComment`;
  // }

  //------------------------

  async delete(slug: string): Promise<BlogComment> {
    return await this.blogCommentModel.findOneAndDelete({ slug });
  }
}
