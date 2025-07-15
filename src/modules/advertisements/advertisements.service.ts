import { Injectable } from "@nestjs/common";
import { CreateAdvertisementDto } from "./dto/create-advertisement.dto";
import { UpdateAdvertisementDto } from "./dto/update-advertisement.dto";
import { InjectModel } from "@nestjs/mongoose";
import {
  Advertisement,
  AdvertisementDocument,
} from "../../schemas/advertisement.schema";
import { Model } from "mongoose";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class AdvertisementsService {
  constructor(
    @InjectModel(Advertisement.name)
    private advertisementModel: Model<AdvertisementDocument>
  ) { }

  async create(
    createAdvertisementDto: CreateAdvertisementDto
  ): Promise<object> {
    createAdvertisementDto["slug"] = UtilSlug.getUniqueId(
      createAdvertisementDto.adName
    );

    return await new this.advertisementModel(createAdvertisementDto).save();
  }

  findAll() {
    return this.advertisementModel.find({});
  }

  findSingleSlider(name: string) {
    return this.advertisementModel.findOne({ adName: name, status: "active" });
  }

  findOne(name: string) {
    return this.advertisementModel.findOne({ adName: name });
  }

  async update(slug: string, updateAdvertisementDto: UpdateAdvertisementDto) {
    return await this.advertisementModel.findOneAndUpdate(
      { slug },
      updateAdvertisementDto,
      { new: true }
    );
  }

  remove(slug: string) {
    return `This action removes a #${slug} advertisement`;
  }
}
