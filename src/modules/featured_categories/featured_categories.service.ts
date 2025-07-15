import { Injectable } from "@nestjs/common";
import { CreateFeaturedCategoryDto } from "./dto/create-featured_category.dto";
import { UpdateFeaturedCategoryDto } from "./dto/update-featured_category.dto";
import {
  FeaturedCategory,
  FeaturedCategoryDocument,
} from "../../schemas/featured-category.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class FeaturedCategoriesService {
  constructor(
    @InjectModel(FeaturedCategory.name)
    private readonly featuredCategoryModel: Model<FeaturedCategoryDocument>
  ) { }

  async create(
    createFeaturedCategoryDto: CreateFeaturedCategoryDto
  ): Promise<object> {
    createFeaturedCategoryDto["slug"] = UtilSlug.getUniqueId(
      createFeaturedCategoryDto.cat_name
    );

    const result = await new this.featuredCategoryModel(
      createFeaturedCategoryDto
    ).save();
    if (result) {
      return { message: "Success" };
    }
  }

  // findAll() {
  //   return `This action returns all popularCategories`;
  // }

  async findAll(query: { slug: string }): Promise<FeaturedCategory[]> {
    return await this.featuredCategoryModel.aggregate([
      // {
      //   $match: {
      //     slug: query.slug,
      //   },
      // },
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
    updateFeaturedCategoryDto: UpdateFeaturedCategoryDto
  ): Promise<UpdateFeaturedCategoryDto> {
    return await this.featuredCategoryModel.findOneAndUpdate(
      { slug },
      updateFeaturedCategoryDto,
      {
        new: true,
      }
    );
  }

  async delete(slug: string): Promise<FeaturedCategory> {
    return await this.featuredCategoryModel.findOneAndDelete({ slug }).exec();
  }

  remove(slug: string) {
    return `This action removes a #${slug} popularCategory`;
  }
}
