import { Injectable } from "@nestjs/common";
import { CreateSeoDto } from "./dto/create-seo.dto";
import { UpdateSeoDto } from "./dto/update-seo.dto";
import { Seo, SeoDocument } from "../../schemas/seo.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class SeoService {
  constructor(
    @InjectModel(Seo.name)
    private seoModel: Model<SeoDocument>
  ) { }
  async create(createSeoDto: CreateSeoDto) {
    const slug = `seo_${createSeoDto.topic}`;
    createSeoDto["slug"] = UtilSlug.getUniqueId(slug);
    console.log(createSeoDto);
    return await this.seoModel.create(createSeoDto);
  }

  async findAll() {
    return await this.seoModel.find();
  }

  findOne(topic: string) {
    return this.seoModel.findOne({ topic });
  }

  update(topic: string, updateSeoDto: UpdateSeoDto) {
    return this.seoModel.findOneAndUpdate({ topic }, updateSeoDto, {
      new: true,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} seo`;
  }
}
