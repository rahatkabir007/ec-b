import { Injectable } from "@nestjs/common";
import { CreateFlashSaleDto } from "./dto/create-flash_sale.dto";
import { UpdateFlashSaleDto } from "./dto/update-flash_sale.dto";
import { InjectModel } from "@nestjs/mongoose";
import { FlashSale, FlashSaleDocument } from "../../schemas/flash_sale.schema";
import { Model } from "mongoose";
import { UtilSlug } from "src/utils/UtilSlug";
import { SearchSortDto } from "src/utils/all-queries.dto";

@Injectable()
export class FlashSaleService {
  constructor(
    @InjectModel(FlashSale.name)
    private readonly flashSaleModel: Model<FlashSaleDocument>
  ) { }
  create(createFlashSaleDto: CreateFlashSaleDto) {
    return this.flashSaleModel.create({
      slug: UtilSlug.getUniqueId(createFlashSaleDto.product_slug),
      product_slug: createFlashSaleDto.product_slug,
      status: createFlashSaleDto.status,
    });
  }
  findAllUser(product_slug: string) {
    return this.flashSaleModel.aggregate([
      {
        $match: {
          status: "active",
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "product_slug",
          foreignField: "slug",
          as: "productsData",
        },
      },
      {
        $unwind: "$productsData",
      },
      // {
      //   $match: {
      //     "productsData.slug": product_slug,
      //   },
      // },
    ]);
  }

  findAll(query: SearchSortDto) {
    return this.flashSaleModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_slug",
          foreignField: "slug",
          as: "productsData",
          pipeline: [
            {
              $match: {
                productName: {
                  $regex: "(?i)" + query.search + "(?-i)",
                },
              },
            },
            {
              $sort: {
                productName: query.sortType === "asc" ? 1 : -1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$productsData",
      },
      {
        $sort: {
          [query.sortBy]: query.sortType === "asc" ? 1 : -1,
        },
      },
    ]);
  }

  findOne(slug: string) {
    return this.flashSaleModel.findOne({ slug });
  }

  async findAllflash(name: string): Promise<FlashSale> {
    return await this.flashSaleModel.findOne({ name }).exec();
  }

  update(slug: string, updateFlashSaleDto: UpdateFlashSaleDto) {
    return this.flashSaleModel.findOneAndUpdate({ slug }, updateFlashSaleDto, {
      new: true,
    });
  }
  // name: string
  async updateflash(updateFlashSaleDto: UpdateFlashSaleDto) {
    return await this.flashSaleModel.findOneAndUpdate(
      { name: updateFlashSaleDto.name },
      updateFlashSaleDto,
      { new: true }
      // , upsert: true
    );
  }

  createflash(createFlashSaleDto: CreateFlashSaleDto) {
    return this.flashSaleModel.create({
      slug: UtilSlug.getUniqueId(createFlashSaleDto.name),
      imageHome: createFlashSaleDto.imageHome,
      sale_status: createFlashSaleDto.status,
      imageFlash: createFlashSaleDto.imageFlash,
      title: createFlashSaleDto.title,
      offer: createFlashSaleDto.offer,
    });
  }

  remove(slug: string) {
    return this.flashSaleModel.findOneAndDelete({ slug });
  }
}
