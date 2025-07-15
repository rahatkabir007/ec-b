import { Injectable } from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Brand, BrandDocument } from "../../schemas/brand.schema";
import { Model, SortOrder } from "mongoose";
import { NewBrand } from "./entities/brand.entity";
import { ServiceHandler } from "src/utils/ServiceHandler";
import { SearchSortDto } from "src/utils/all-queries.dto";
import { ISearchSortQuery } from "src/interfaces/SearchSortQuery";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>
  ) { }

  async create(createBrandDto: CreateBrandDto) {
    createBrandDto["slug"] = UtilSlug.getUniqueId(createBrandDto.name);
    const createdBrand = await this.brandModel.create(createBrandDto);
    return createdBrand;
  }

  async findAll(query: any): Promise<NewBrand[]> {
    const allBrands = await this.brandModel
      .find({ name: new RegExp(query.search, "i") })
      .sort({ [query.sortBy]: query.sortType });

    // const sortType: SortOrder | string = query.sortType;

    // const key = query.sortBy;
    // const newQuery: ISearchSortQuery = {
    //   search: query.search,
    //   sort: {
    //     // key: query.sortType,
    //     [`${key}`]: sortType
    //   },
    // };

    // const allBrands = await ServiceHandler.queryHandler(
    //   this.brandModel,
    //   newQuery
    // );

    const trimmedBrands = allBrands.map((brand) => {
      const newBrand = {
        sn: 1,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        status: brand.status,
      };
      return newBrand;
    });
    return trimmedBrands;
  }
  async findAllBrand(): Promise<NewBrand[]> {
    const allBrands = await this.brandModel.find({ status: "active" });

    return allBrands;
  }

  async findOne(slug: string): Promise<Brand> {
    const singleBrand = await this.brandModel.findOne({ slug: slug });
    return singleBrand;
  }

  async update(
    slug: string,
    updateBrandDto: UpdateBrandDto
  ): Promise<BrandDocument> {
    const updatedBrand = await this.brandModel.findOneAndUpdate(
      { slug: slug },
      updateBrandDto,
      { new: true }
    );

    return updatedBrand;

    // if (updatedBrand) {
    //   return { message: "updated successfully" };
    // } else {
    //   return { message: "could not updated" };
    // }
  }

  async remove(slug: string): Promise<BrandDocument> {
    const deletedBrand = await this.brandModel.findOneAndDelete({ slug: slug });
    return deletedBrand;
  }
}
