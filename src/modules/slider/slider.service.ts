import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Slider, SliderDocument } from "../../schemas/slider.schema";
import { UtilSlug } from "src/utils/UtilSlug";
import { CreateSliderDto } from "./dto/create-slider.dto";
import { UpdateSliderDto } from "./dto/update-slider.dto";

@Injectable()
export class SliderService {
  constructor(
    @InjectModel(Slider.name)
    private readonly sliderModel: Model<SliderDocument>
  ) { }
  // create(createSliderDto: CreateSliderDto) {
  //   return "This action adds a new slider";
  // }

  async create(createSliderDto: CreateSliderDto): Promise<Object> {
    const slug = `slider`;
    // ${createSliderDto.titleOne}
    createSliderDto["slug"] = UtilSlug.getUniqueId(slug);

    const result = await new this.sliderModel(createSliderDto).save();

    if (result) {
      return {
        data: result,
        message: "Order successfull ",
      };
    } else {
      return {
        message: "Order  failed !",
      };
    }
  }

  // findAll() {
  //   return `This action returns all slider`;
  // }

  async findAll(): Promise<Slider[]> {
    return await this.sliderModel
      .find({ status: "active" })
      .sort({ serial: 1 });
  }
  // new RegExp(query.search, "d")

  async findAllAdminSliders(query: any) {
    const allSliderData = await this.sliderModel
      .find({
        titleOne: new RegExp(query.search, "i"),
      })
      .sort({ [query.sortBy]: query.sortType });

    return allSliderData;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} slider`;
  // }

  async findOne(slug: string) {
    const sliderFind = await this.sliderModel.findOne({ slug: slug });
    return sliderFind;
  }

  // update(id: number, updateSliderDto: UpdateSliderDto) {
  //   return `This action updates a #${id} slider`;
  // }

  async update(
    slug: string,
    updateSliderDto: UpdateSliderDto
  ): Promise<UpdateSliderDto> {
    return await this.sliderModel.findOneAndUpdate({ slug }, updateSliderDto, {
      new: true,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} slider`;
  // }

  async delete(slug: string): Promise<Slider> {
    return await this.sliderModel.findOneAndDelete({ slug }).exec();
  }
}
