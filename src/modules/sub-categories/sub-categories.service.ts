import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  SubCategories,
  SubCategoriesDocument,
} from "../../schemas/sub-category.schema";
import { CreateSubCategoryDto } from "./dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category.dto";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel(SubCategories.name)
    private readonly subCategoryModel: Model<SubCategoriesDocument>
  ) { }

  // create(createSubCategoryDto: CreateSubCategoryDto) {
  //   return "This action adds a new subCategory";
  // }

  async findAllAdminSubCategories(query: any): Promise<SubCategoriesService[]> {
    const result = await this.subCategoryModel
      .aggregate([
        {
          $match: {
            subcat_name: new RegExp(query.search, "i"),
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "cat_slug",
            foreignField: "cat_slug",
            as: "mufez",
          },
        },
        {
          $unwind: "$mufez",
        },

        // {
        //   $group: { _id: "$_id", categories: { $push: "$$ROOT" } },
        // },
        // {
        //   $addFields: {
        //     cat_name: "$mufez.cat_slug",
        //   },
        // },
        // {
        //   $unset: {},
        // },
        // {
        //   $replaceRoot: {
        //     newRoot: {
        //       $mergeObjects: [{ $arrayElemAt: ["$mufez", 0] }, "$$ROOT"],
        //     },
        //   },
        // },
        {
          $project: {
            _id: 0,
            slug: 1,
            cat_slug: 1,
            subcat_name: 1,
            subcat_status: 1,
            cat_name: "$mufez.cat_name",
            // $mufez.cat_name
          },
        },
      ])
      .sort({ [query.sortBy]: query.sortType });

    return result;
    // return await this.subCategoryModel.find();
  }
  async findAllSubCategories(): Promise<any> {
    const allSubCat = await this.subCategoryModel.find({
      subcat_status: "active",
    });
    return allSubCat;

    // return await this.subCategoryModel.find();
  }

  // async findAllAdminSubCategories(query: any) {
  //   const allSubCategoriesData = await this.subCategoryModel
  //     .find({ subcat_name: new RegExp(query.search, "i") })
  //     .sort({ [query.sortBy]: query.sortType });

  //   return allSubCategoriesData;
  // }

  async findOne(slug: string) {
    const subCategoryFind = await this.subCategoryModel.findOne({ slug: slug });

    return subCategoryFind;
  }

  async create(createSubCategoryDto: CreateSubCategoryDto): Promise<object> {
    const slug = `${createSubCategoryDto.cat_slug}_${createSubCategoryDto.subcat_name}`;
    createSubCategoryDto["slug"] = UtilSlug.getUniqueId(slug);
    const result = await new this.subCategoryModel(createSubCategoryDto).save();
    if (result) {
      return { message: "Success" };
    }
  }

  async update(
    slug: string,
    updateSubCategoryDto: UpdateSubCategoryDto
  ): Promise<UpdateSubCategoryDto> {
    return await this.subCategoryModel.findOneAndUpdate(
      { slug },
      updateSubCategoryDto,
      {
        new: true,
      }
    );
  }

  async delete(slug: string): Promise<SubCategories> {
    return await this.subCategoryModel.findOneAndDelete({ slug }).exec();
  }

  // findAll() {
  //   return `This action returns all subCategories`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} subCategory`;
  // }

  // update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
  //   return `This action updates a #${id} subCategory`;
  // }

  remove(id: number) {
    return `This action removes a #${id} subCategory`;
  }
}
