import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  PopularCategory,
  PopularCategoryDocument,
} from "../../schemas/popular-category.schema";
import { CreatePopularCategoryDto } from "./dto/create-popular_category.dto";
import { UpdatePopularCategoryDto } from "./dto/update-popular_category.dto";
import { UtilSlug } from "./../../utils/UtilSlug";

@Injectable()
export class PopularCategoriesService {
  constructor(
    @InjectModel(PopularCategory.name)
    private readonly popularCategoryModel: Model<PopularCategoryDocument>
  ) { }
  // create(createPopularCategoryDto: CreatePopularCategoryDto) {
  //   return 'This action adds a new popularCategory';
  // }

  async create(
    createPopularCategoryDto: CreatePopularCategoryDto
  ): Promise<object> {
    createPopularCategoryDto["slug"] = UtilSlug.getUniqueId(
      createPopularCategoryDto.cat_name
    );

    const result = await new this.popularCategoryModel(
      createPopularCategoryDto
    ).save();
    if (result) {
      return { message: "Success" };
    }
  }

  // findAll() {
  //   return `This action returns all popularCategories`;
  // }

  async findAll(query: { slug: string }): Promise<PopularCategory[]> {
    return await this.popularCategoryModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "cat_slug",
          foreignField: "cat_slug",
          as: "categoriesData",
        },
      },
      {
        $unwind: "$categoriesData",
      },
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} popularCategory`;
  }

  // update(slug: string, updatePopularCategoryDto: UpdatePopularCategoryDto) {
  //   return `This action updates a #${slug} popularCategory`;
  // }

  async update(
    slug: string,
    updatePopularCategoryDto: UpdatePopularCategoryDto
  ): Promise<UpdatePopularCategoryDto> {
    return await this.popularCategoryModel.findOneAndUpdate(
      { slug },
      updatePopularCategoryDto,
      {
        new: true,
      }
    );
  }

  async delete(slug: string): Promise<PopularCategory> {
    return await this.popularCategoryModel.findOneAndDelete({ slug }).exec();
  }

  remove(slug: string) {
    return `This action removes a #${slug} popularCategory`;
  }
}
