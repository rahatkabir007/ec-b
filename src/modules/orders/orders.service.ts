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
const SSLCommerzPayment = require("sslcommerz-lts");
import { Cart, CartDocument } from "src/schemas/cart.schema";
import { Coupon, CouponDocument } from "src/schemas/coupon.schema";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>
  ) {}

  // ------------------post order--------------------- //
  async createSSL(createOrderDto: CreateOrderDto) {
    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASSWORD;
    const is_live = false;

    const slug = `order_${createOrderDto.user_slug}`;
    createOrderDto["slug"] = UtilSlug.getUniqueId(slug);

    let trans_id = UtilSlug.getUniqueId("transaction");
    const sslcommerzParams = {
      total_amount: createOrderDto.total,
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

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    const returnData: { data: string; message: string } = {
      data: "",
      message: "",
    };

    await sslcz.init(sslcommerzParams).then(async (apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      console.log({ apiResponse });

      if (apiResponse && apiResponse.status === "SUCCESS") {
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
          returnData.data = GatewayPageURL;
          returnData.message = "SSL Order successful";
        } else {
          returnData.data = apiResponse.redirectGatewayURL;
          returnData.message = "Order failed!";
        }
      } else {
        returnData.data = apiResponse.redirectGatewayURL;
        returnData.message = "SSL Order Unsuccessful";
      }
    });

    return returnData;
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
        message: "COD Order successful",
      };
    } else {
      return {
        message: "Order failed!",
      };
    }
  }

  async createBkashOrder(createOrderDto: CreateOrderDto): Promise<Object> {
    // const slug = `order_${createOrderDto.user_slug}`;
    createOrderDto["slug"] = UtilSlug.getUniqueId();

    const result = await new this.orderModel({
      ...createOrderDto,
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

    // const couponApplyUpdate = async (couponSlug: string) => {
    //   await this.couponModel.findOneAndUpdate(
    //     { code: couponSlug },
    //     {
    //       $inc: {
    //         apply_qty: +1,
    //       },
    //     }
    //   );
    // };
    // couponApplyUpdate("happy_new_year");

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
        message: "BKash Order successful",
      };
    } else {
      return {
        message: "Order failed!",
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
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);

    const allOrdersCount = await this.orderModel.aggregate([
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
      { $count: "totalOrders" },
    ]);

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
        $skip: page * limit,
      },
      {
        $limit: limit,
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

    const filteredOrdersCount = await this.orderModel.aggregate([
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
      { $count: "totalFilteredOrders" },
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
        $skip: page * limit,
      },
      {
        $limit: limit,
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

    return {
      allOrdersData,
      allOrdersCount:
        allOrdersCount.length !== 0 ? allOrdersCount[0].totalOrders : 0,
      filteredOrdersData,
      filteredOrdersCount:
        filteredOrdersCount.length !== 0
          ? filteredOrdersCount[0].totalFilteredOrders
          : 0,
    };
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
          // price: 1,
          // offerPrice: 1,
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

  // async findSingleOrderOfSeller(query: {
  //   seller_slug: string;
  //   order_slug: string;
  // }) {
  //   // console.log(slug, "slug from or ser");
  //   const orderDataBySeller = await this.orderModel.aggregate([
  //     {
  //       $match: {
  //         "product_list.seller_slug": query.seller_slug,
  //         slug: query.order_slug,
  //       },
  //     },
  //     {
  //       $project: {
  //         slug: 1,
  //         order_status: 1,
  //         payment_status: 1,
  //         createdAt: 1,
  //         discount: 1,
  //         shippingCost: 1,
  //         payment_method: 1,
  //         transaction_id: 1,
  //         address: 1,
  //         seller_slug: 1,
  //         user_slug: 1,
  //         // price: 1,
  //         // offerPrice: 1,
  //         product_list: {
  //           $filter: {
  //             input: "$product_list",
  //             as: "products",
  //             cond: {
  //               $eq: ["$$products.seller_slug", query.seller_slug],
  //             },
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "user_slug",
  //         foreignField: "slug",
  //         as: "userData",
  //       },
  //     },
  //     {
  //       $unwind: "$userData",
  //     },
  //   ]);
  //   console.log(orderDataBySeller);
  //   return orderDataBySeller;
  // }

  async findSingleOrderOfSeller(query: {
    seller_slug: string;
    order_slug: string;
  }) {
    const orderDataBySeller = await this.orderModel.aggregate([
      {
        $match: {
          "product_list.seller_slug": query.seller_slug,
          slug: query.order_slug,
        },
      },
      {
        $project: {
          slug: 1,
          order_status: 1,
          payment_status: 1,
          createdAt: 1,
          discount: 1,
          shippingCost: 1,
          payment_method: 1,
          transaction_id: 1,
          address: 1,
          seller_slug: 1,
          user_slug: 1,
          product_list: {
            $filter: {
              input: "$product_list",
              as: "products",
              cond: {
                $eq: ["$$products.seller_slug", query.seller_slug],
              },
            },
          },
          total: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$product_list",
                    as: "products",
                    cond: {
                      $and: [
                        { $eq: ["$$products.seller_slug", query.seller_slug] },
                        {
                          $ifNull: [
                            "$$products.offerPrice",
                            { $ne: ["$$products.offerPrice", null] },
                          ],
                        },
                      ],
                    },
                  },
                },
                as: "p",
                in: {
                  $cond: {
                    if: { $eq: ["$$p.offerPrice", null] },
                    then: "$$p.price",
                    else: "$$p.offerPrice",
                  },
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "product_list.seller_slug",
          foreignField: "slug",
          as: "sellerData",
        },
      },
      {
        $unwind: "$sellerData",
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
    return orderDataBySeller[0];
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
    const order = await this.orderModel.findOne({ transaction_id });
    await this.cartModel.deleteMany({ user_slug: order.user_slug });
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
    const result = await this.orderModel.findOneAndRemove({ transaction_id });
    return {
      data: result,
      message: "Payment failed, Try Again",
    };
  }

  async SSLCommerz_payment_cancel(transaction_id: string) {
    const result = await this.orderModel.findOneAndRemove({ transaction_id });
    return {
      data: result,
      message: "Payment failed, Try Again",
    };
  }
}
