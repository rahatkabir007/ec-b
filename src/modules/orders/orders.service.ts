import { CreateAddressDto } from "./../addresses/dto/create-address.dto";
import { UtilSlug } from "./../../utils/UtilSlug";
import { OrderDocument } from "./../../schemas/order.schema";
import { Injectable } from "@nestjs/common";
import { Order } from "src/schemas/order.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Inventory, InventoryDocument } from "src/schemas/inventory.schema";
import { Product, ProductDocument } from "src/schemas/product.schema";
//@ts-ignore
import * as SSLCommerz from "sslcommerz-nodejs";

@Injectable()
export class OrdersService {
  private sslcommerz: SSLCommerz;

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>
  ) {
    this.sslcommerz = new SSLCommerz({
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASSWORD,
      isSandboxMode: true, // Set to false in production
    });
  }

  // ------------------post order--------------------- //
  async createSSL(createOrderDto: CreateOrderDto): Promise<Object> {
    const slug = `order_${createOrderDto.user_slug}`;
    createOrderDto["slug"] = UtilSlug.getUniqueId(slug);
    let trans_id = UtilSlug.getUniqueId("transaction");
    const sslcommerzParams = {
      total_amount: createOrderDto.subTotal,
      currency: "BDT",
      tran_id: trans_id,
      success_url: `${process.env.API_URL}/orders/payment/success/${trans_id}`,
      fail_url: `${process.env.API_URL}/orders/payment/fail/${trans_id}`,
      cancel_url: `${process.env.API_URL}/orders/payment/cancel/${trans_id}`,
      ipn_url: `${process.env.API_URL}/orders/payment/ipn`,
      shipping_method: "NO",
      product_name: "Order Payment",
      product_category: "Ecommerce",
      product_profile: "general",
      cus_name: createOrderDto.user_name,
      cus_email: createOrderDto.user_email,
      cus_add1: createOrderDto.address.address,
      cus_city: createOrderDto.address.city,
      cus_country: "Bangladesh",
      cus_phone: createOrderDto?.user_phone,
      cus_state: createOrderDto.address.state,
      shipping_city: createOrderDto.address.city,
      shipping_country: "Bangladesh",
      shipping_state: createOrderDto.address.state,
      billing_address: createOrderDto.address.address,
      billing_city: createOrderDto.address.city,
      billing_country: "Bangladesh",
      billing_name: createOrderDto.user_name,
      billing_phone: createOrderDto.user_phone,
      billing_state: createOrderDto.address.state,
    };
    const response = await this.sslcommerz.init_transaction(sslcommerzParams);

    if (response && response.status === "SUCCESS") {
      const result = await new this.orderModel({
        ...createOrderDto,
        transaction_id: trans_id,
      }).save();

      const updateProductStock = async (data) => {
        await this.productModel.findOneAndUpdate(
          { slug: data.slug },
          {
            $inc: {
              stock: -data.quantity,
            },
          }
        );
      };

      let stockProducts = [];

      for (let product of createOrderDto.product_list) {
        let p = {
          slug: UtilSlug.getUniqueId("stock"),
          //@ts-ignore
          product_slug: product.slug,
          //@ts-ignore
          quantity: product.quantity,
          type: "stockOut",
        };

        stockProducts.push(p);

        await updateProductStock(product);
      }

      await this.inventoryModel.create(stockProducts);
      if (result) {
        // console.log(response.GatewayPageURL);
        return {
          data: response.GatewayPageURL,
          message: "Order successfull ",
        };
      } else {
        return {
          message: "Order  failed !",
        };
      }
    } else {
      return {
        status: "FAILED",
        errorMessage: "Unable to initiate payment",
      };
    }
  }

  async createCOD(createOrderDto: CreateOrderDto): Promise<Object> {
    const slug = `order_${createOrderDto.user_slug}`;
    createOrderDto["slug"] = UtilSlug.getUniqueId(slug);
    let trans_id = UtilSlug.getUniqueId("transaction");

    const result = await new this.orderModel({
      ...createOrderDto,
      transaction_id: trans_id,
    }).save();

    const updateProductStock = async (data) => {
      await this.productModel.findOneAndUpdate(
        { slug: data.slug },
        {
          $inc: {
            stock: -data.quantity,
          },
        }
      );
    };

    let stockProducts = [];

    for (let product of createOrderDto.product_list) {
      let p = {
        slug: UtilSlug.getUniqueId("stock"),
        //@ts-ignore
        product_slug: product.slug,
        //@ts-ignore
        quantity: product.quantity,
        type: "stockOut",
      };

      stockProducts.push(p);

      await updateProductStock(product);
    }

    await this.inventoryModel.create(stockProducts);
    if (result) {
      // console.log(response.GatewayPageURL);
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

  async findAllCompleted(slug: string, order_status: string) {
    const result = await this.orderModel.find({
      user_slug: slug,
      order_status: new RegExp(order_status, "i"),
    });

    return {
      data: result,
      message: "fetched Successfully",
    };
  }

  async findAllOrdersAdmin(query: any) {
    let match_value = new RegExp(query.search, "i");
    const allOrdersData = await this.orderModel.aggregate([
      {
        $match: {
          slug: {
            $regex: match_value,
          },
        },
      },
      {
        $sort: {
          [query.sortBy]: query.sortType === "asc" ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_slug",
          foreignField: "slug",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
    ]);

    const filteredOrdersData = await this.orderModel.aggregate([
      {
        $match: {
          slug: {
            $regex: match_value,
          },
          order_status: query.order_status,
        },
      },
      {
        $sort: {
          [query.sortBy]: query.sortType === "asc" ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_slug",
          foreignField: "slug",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
    ]);

    return { allOrdersData, filteredOrdersData };
  }
  // get all order for seller wise-----here "slug" is seller slug
  async findAllOrderForSeller(slug: string, query: any) {
    console.log(slug, "slug from or ser");
    const orderDataBySeller = await this.orderModel.aggregate([
      {
        $match: {
          "product_list.seller_slug": slug,
        },
      },
      {
        $project: {
          slug: 1,
          order_status: 1,
          payment_status: 1,
          createdAt: 1,
          total: 1,
          seller_slug: 1,
          user_slug: 1,
          product_list: {
            $filter: {
              input: "$product_list",
              as: "products",
              cond: {
                $eq: ["$$products.seller_slug", slug],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_slug",
          foreignField: "slug",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
    ]);
    console.log(orderDataBySeller);
    return orderDataBySeller;
  }

  // ---------------------------
  async findOne(slug: string) {
    return await this.orderModel.findOne({ slug });
  }

  async update(slug: string, updateOrderDto: UpdateOrderDto) {
    const result = await this.orderModel.findOneAndUpdate(
      { slug },
      updateOrderDto,
      { new: true }
    );
    return result;
  }

  async remove(slug: string) {
    return await this.orderModel.deleteOne({ slug });
  }

  async SSLCommerz_payment_success(transaction_id: string) {
    console.log(transaction_id);
    await this.orderModel.findOneAndUpdate(
      { transaction_id },
      {
        payment_status: "success",
      },
      { new: true }
    );
    return {
      data: "success",
      message: "success",
    };
  }

  async SSLCommerz_payment_fail(transaction_id: string) {
    const result = await this.orderModel.findOneAndDelete({ transaction_id });
    return {
      data: result,
      message: "Payment failed, Try Again",
    };
  }

  async SSLCommerz_payment_cancel(transaction_id: string) {
    const result = await this.orderModel.findOneAndDelete({ transaction_id });
    return {
      data: result,
      message: "Payment failed, Try Again",
    };
  }
}
