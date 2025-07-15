import { Injectable } from "@nestjs/common";
import { CreateReporteditemDto } from "./dto/create-reporteditem.dto";
import { UpdateReporteditemDto } from "./dto/update-reporteditem.dto";
import { InjectModel } from "@nestjs/mongoose";
import {
  ReportedItem,
  ReportedItemDocument,
} from "../../schemas/reported-item.schema";
import { Model } from "mongoose";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class ReporteditemsService {
  constructor(
    @InjectModel(ReportedItem.name)
    private readonly reportedItemModel: Model<ReportedItemDocument>
  ) { }

  async create(createReporteditemDto: CreateReporteditemDto): Promise<Object> {
    const slug = `report_${createReporteditemDto.user_slug}_${createReporteditemDto.product_slug}`;
    createReporteditemDto["slug"] = UtilSlug.getUniqueId(slug);
    const result = await new this.reportedItemModel(
      createReporteditemDto
    ).save();
    return result;
  }
  // findAll(): Promise<ReportedItem[]> {
  //   return await this.reportedItemModel.find().exec();
  // }

  async findAllForAdmin(query: any): Promise<ReportedItem[]> {
    let match_value = new RegExp(query.search, "i");
    return await this.reportedItemModel
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "product_slug",
            foreignField: "slug",
            as: "reportedProducts",
          },
        },
        {
          $unwind: "$reportedProducts",
        },
        {
          $lookup: {
            from: "users",
            localField: "user_slug",
            foreignField: "slug",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            "user.fullName": match_value,
          },
        },
      ])
      .sort({ [query.sortBy]: query.sortType });
  }

  async findAllForSeller(
    query: any,
    seller_slug: string
  ): Promise<ReportedItem[]> {
    let match_value = new RegExp(query.search, "i");
    return await this.reportedItemModel
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "product_slug",
            foreignField: "slug",
            as: "reportedProducts",
          },
        },
        {
          $unwind: "$reportedProducts",
        },
        {
          $match: {
            "reportedProducts.seller_slug": seller_slug,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_slug",
            foreignField: "slug",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            "user.fullName": match_value,
          },
        },
      ])
      .sort({ [query.sortBy]: query.sortType });
  }

  async findSingleReportForSeller(slug: string): Promise<ReportedItem[]> {
    const result = await this.reportedItemModel.aggregate([
      {
        $match: {
          slug: slug,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_slug",
          foreignField: "slug",
          as: "reportedProducts",
        },
      },
      {
        $unwind: "$reportedProducts",
      },

      {
        $lookup: {
          from: "users",
          localField: "user_slug",
          foreignField: "slug",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    return result[0];
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} reporteditem`;
  // }
  async findOne(slug: string) {
    console.log(slug);
    const categoryFind = await this.reportedItemModel.findOne({ slug: slug });
    console.log(categoryFind);
    return categoryFind;
  }

  update(id: number, updateReporteditemDto: UpdateReporteditemDto) {
    return `This action updates a #${id} reporteditem`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} reporteditem`;
  // }

  async delete(slug: string): Promise<ReportedItem> {
    return await this.reportedItemModel.findOneAndDelete({ slug }).exec();
  }
}
