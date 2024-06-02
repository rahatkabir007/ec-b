import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  WithdrawMethod,
  WithdrawMethodDocument,
} from "./../../schemas/withdraw_method.schema";
import { Injectable } from "@nestjs/common";
import { CreateWithdrawMethodDto } from "./dto/create-withdraw_method.dto";
import { UpdateWithdrawMethodDto } from "./dto/update-withdraw_method.dto";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class WithdrawMethodsService {
  constructor(
    @InjectModel(WithdrawMethod.name)
    private readonly withdrawMethodModel: Model<WithdrawMethodDocument>
  ) {}

  async create(createWithdrawDto: CreateWithdrawMethodDto) {
    createWithdrawDto["slug"] = UtilSlug.getUniqueId(createWithdrawDto.name);
    return await this.withdrawMethodModel.create(createWithdrawDto);
  }

  async findAll(query: any) {
    return await this.withdrawMethodModel
      .find({ name: new RegExp(query.search, "i") })
      .sort({ [query.sortBy]: query.sortType });
  }

  async findOne(slug: string) {
    return await this.withdrawMethodModel.findOne({ slug });
  }

  async update(slug: string, updateWithdrawMethodDto: UpdateWithdrawMethodDto) {
    return await this.withdrawMethodModel.findOneAndUpdate(
      { slug: slug },
      updateWithdrawMethodDto,
      { new: true }
    );
  }

  async remove(slug: string) {
    return await this.withdrawMethodModel.findOneAndRemove({ slug });
  }
}
