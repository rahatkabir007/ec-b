import { UtilSlug } from "./../../utils/UtilSlug";
import { Injectable } from "@nestjs/common";
import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { UpdateInventoryDto } from "./dto/update-inventory.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Inventory, InventoryDocument } from "../../schemas/inventory.schema";
import { Model } from "mongoose";
import { Product, ProductDocument } from "../../schemas/product.schema";
import { SearchSortDto } from "src/utils/all-queries.dto";

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>
  ) { }
  async create(createInventoryDto: CreateInventoryDto) {
    createInventoryDto["slug"] = UtilSlug.getUniqueId("stock");

    await this.productModel.findOneAndUpdate(
      { slug: createInventoryDto.product_slug },
      {
        $inc: {
          stock: createInventoryDto.quantity,
        },
      }
    );

    return await this.inventoryModel.create(createInventoryDto);
  }

  findAll() {
    return this.inventoryModel.find();
  }

  findOne(slug: string) {
    return this.inventoryModel.findOne({ slug });
  }

  update(slug: string, updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryModel.findOneAndUpdate({ slug }, updateInventoryDto, {
      new: true,
    });
  }

  remove(slug: string) {
    return this.inventoryModel.deleteOne({ slug });
  }
}
