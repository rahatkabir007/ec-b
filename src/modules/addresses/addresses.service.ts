import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddressDocument } from "../../schemas/address.schema";
import { UtilSlug } from "src/utils/UtilSlug";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Address } from "./entities/address.entity";

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>
  ) { }

  async create(createAddressDto: CreateAddressDto): Promise<object> {
    const slug = `address ` + createAddressDto.user_slug;
    createAddressDto["slug"] = UtilSlug.getUniqueId(slug);

    const result = await new this.addressModel(createAddressDto).save();
    if (result) {
      return { message: "Success" };
    }
    // return "This action adds a new address";
  }

  async findAll(email: string): Promise<Address[]> {
    return await this.addressModel.find({ email }).exec();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} address`;
  // }

  // update(id: number, updateAddressDto: UpdateAddressDto) {
  //   return `This action updates a #${id} address`;
  // }

  async update(
    slug: string,
    updateAddressDto: UpdateAddressDto
  ): Promise<UpdateAddressDto> {
    return await this.addressModel.findOneAndUpdate(
      { slug },
      {
        $set: {
          ...updateAddressDto,
        },
      },

      {
        upsert: true,
        new: true,
      }
    );
  }

  async remove(slug: string): Promise<Address> {
    return await this.addressModel.findOneAndDelete({ slug }).exec();
  }
}
