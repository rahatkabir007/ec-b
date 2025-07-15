import { Product } from "./../../schemas/product.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WishlistDocument, Wishlist } from "../../schemas/wishlist.schema";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>
  ) { }
  //create wishlist product
  async create(createWishlistDto: CreateWishlistDto): Promise<Object> {
    const slug = createWishlistDto.user_slug + " " + createWishlistDto.slug;
    createWishlistDto["wishlist_slug"] = UtilSlug.getUniqueId(slug);
    const result = await new this.wishlistModel(createWishlistDto).save();

    if (result) {
      delete result._id;
      return {
        data: result,
        message: "success-wishlist",
      };
    } else {
      return {
        message: "error-wishlist",
      };
    }
  }
  //get all wishlist product
  async findAll(user_slug: string): Promise<Wishlist[]> {
    return await this.wishlistModel.aggregate([
      {
        $match: {
          user_slug: user_slug,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
  }

  //delete single wishlist product
  async delete(user_slug: string, product_slug: string) {
    return await this.wishlistModel
      .findOneAndDelete({ user_slug, slug: product_slug })
      .exec();
  }

  //delete all wishlist product
  async deleteAll(user_slug: string) {
    return await this.wishlistModel.deleteMany({ user_slug: user_slug });
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} wishlist`;
  // }
}
