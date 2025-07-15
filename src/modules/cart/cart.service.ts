import { Injectable } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { Cart, CartDocument } from "../../schemas/cart.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UtilSlug } from "src/utils/UtilSlug";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>
  ) { }
  async create(createCartDto: CreateCartDto): Promise<Object> {
    const slug = createCartDto.user_slug + " " + createCartDto.product_slug;
    createCartDto["slug"] = UtilSlug.getUniqueId(slug);
    const result = await new this.cartModel(createCartDto).save();
    if (result) {
      return result;
    }
  }

  findAll(query: { user_slug: string }) {
    return this.cartModel.aggregate([
      {
        $match: {
          user_slug: query.user_slug,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_slug",
          foreignField: "slug",
          as: "cartProducts",
        },
      },
      {
        $unwind: "$cartProducts",
      },
      {
        $addFields: {
          "cartProducts.quantity": "$quantity",
          "cartProducts.cart_slug": "$slug",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$cartProducts",
        },
      },
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(cart_slug: string, updateCartDto: UpdateCartDto) {
    const updatedCart = await this.cartModel.findOneAndUpdate(
      { slug: cart_slug },
      updateCartDto,
      { new: true }
    );
    return updatedCart;
  }

  async remove(user_slug: string, product_slug: string): Promise<Cart> {
    return await this.cartModel.findOneAndDelete({
      user_slug: user_slug,
      product_slug: product_slug,
    });
  }

  //delete all cart product
  async deleteAll(user_slug: string) {
    return await this.cartModel.deleteMany({ user_slug });
  }
}
