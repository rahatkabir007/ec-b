import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Seller, SellerDocument } from "../../schemas/seller.schema";
import { UtilSlug } from "src/utils/UtilSlug";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>
  ) { }

  async create(createSellerDto: CreateSellerDto): Promise<Object> {
    createSellerDto["slug"] = UtilSlug.getUniqueId(createSellerDto.email);
    const result = await new this.sellerModel(createSellerDto).save();
    return result;
  }

  // ****************************************

  findAll() {
    return `This action returns all seller`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seller`;
  }

  update(id: number, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller`;
  }

  remove(id: number) {
    return `This action removes a #${id} seller`;
  }
}
