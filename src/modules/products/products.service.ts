import { query } from "express";
// import { serviceHandler } from "./../../utils/ServiceHandler";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product, ProductDocument } from "src/schemas/product.schema";
import { Model } from "mongoose";
import { UtilSlug } from "./../../utils/UtilSlug";
import { SearchSortDto } from "src/utils/all-queries.dto";
import { User, UserDocument } from "src/schemas/user.schema";
import { UploadService } from "../upload/upload.service";
import { ProductDto } from "./dto/product-dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly uploadService: UploadService,
  ) {}

  async create(file, productDto: ProductDto): Promise<Object> {
    const createProductDto = new CreateProductDto();
    if (file) {
      const response = this.uploadService.handleFileUpload([file]);
      // console.log(response)
      createProductDto.imageURL = response[0].url;
    }
    const productData = JSON.parse(productDto?.data);
    // console.log(productData)

    // Copy properties from productData to createProductDto
    Object.assign(createProductDto, productData);

    createProductDto["slug"] = UtilSlug.getUniqueId(productData.productName);

    const result = await new this.productModel(createProductDto).save();
    if (result) {
      return {
        data: result,
        message: "success",
      };
    } else {
      return {
        message: "error",
      };
    }
  }

  async findFilteredProducts(query: {
    search: string;
    categories: string;
    sub_category: string;
    brands: string;
    highlight: string;
    max: string;
    min: string;
  }): Promise<Product[]> {
    const search = query.search;
    const categoriesStrArr = query.categories
      ? query.categories.split(" ").slice(1)
      : [""];
    const brandsStrArr = query.brands ? query.brands.split(" ").slice(1) : [""];
    const maxRange = parseInt(query.max);
    const minRange = parseInt(query.min);

    // console.log({ categoriesStrArr, brandsStrArr, maxRange, minRange });

    const categoryFilter = Object.assign(
      query.categories
        ? {
            $or: categoriesStrArr.map((cat) => {
              return {
                catSlug: {
                  $regex: "(?i)" + cat + "(?-i)",
                },
              };
            }),
          }
        : {}
    );

    const brandFilter = Object.assign(
      query.brands
        ? {
            $or: brandsStrArr.map((brand) => {
              return {
                brandSlug: {
                  $regex: "(?i)" + brand + "(?-i)",
                },
              };
            }),
          }
        : {}
    );

    const highlightFilter = Object.assign(
      query.highlight
        ? {
            [query.highlight]: true,
          }
        : {}
    );

    const subCategoryFilter = Object.assign(
      query.sub_category
        ? {
            subCatSlug: query.sub_category,
          }
        : {}
    );

    console.log(
      categoryFilter,
      subCategoryFilter,
      brandFilter,
      highlightFilter
    );

    const filteredProducts = await this.productModel.aggregate([
      {
        $match: {
          $and: [
            {
              productName: { $regex: "(?i)" + search + "(?-i)" },
            },
            {
              status: "active",
            },
            categoryFilter,
            brandFilter,
            highlightFilter,
            subCategoryFilter,
            {
              $or: [
                {
                  price: {
                    $gte: minRange,
                    $lte: maxRange,
                  },
                },
                {
                  offerPrice: {
                    $gte: minRange,
                    $lte: maxRange,
                  },
                },
              ],
            },
          ],
        },
      },
    ]);

    return filteredProducts;
  }

  async findFilteredProductsBySeller(
    shopName: string,
    query: {
      search: string;
      categories: string;
      sub_category: string;
      brands: string;
      highlight: string;
      max: string;
      min: string;
    }
  ): Promise<{ sellerData: User; filteredProducts: Product[] }> {
    const search = query.search;
    const categoriesStrArr = query.categories
      ? query.categories.split(" ").slice(1)
      : [""];
    const brandsStrArr = query.brands ? query.brands.split(" ").slice(1) : [""];
    const maxRange = parseInt(query.max);
    const minRange = parseInt(query.min);

    // console.log({ categoriesStrArr, brandsStrArr, maxRange, minRange });

    const seller = await this.userModel.findOne({ "shop.shop_name": shopName });
    if (!seller) {
      return { sellerData: null, filteredProducts: [] };
    }

    const sellerSlug = seller.slug;

    const categoryFilter = Object.assign(
      query.categories
        ? {
            $or: categoriesStrArr.map((cat) => {
              return {
                catSlug: {
                  $regex: "(?i)" + cat + "(?-i)",
                },
              };
            }),
          }
        : {}
    );

    const brandFilter = Object.assign(
      query.brands
        ? {
            $or: brandsStrArr.map((brand) => {
              return {
                brandSlug: {
                  $regex: "(?i)" + brand + "(?-i)",
                },
              };
            }),
          }
        : {}
    );

    const highlightFilter = Object.assign(
      query.highlight
        ? {
            [query.highlight]: true,
          }
        : {}
    );

    const subCategoryFilter = Object.assign(
      query.sub_category
        ? {
            subCatSlug: query.sub_category,
          }
        : {}
    );

    console.log(
      categoryFilter,
      subCategoryFilter,
      brandFilter,
      highlightFilter
    );

    const filteredProducts = await this.productModel.aggregate([
      {
        $match: {
          $and: [
            {
              seller_slug: sellerSlug,
            },
            {
              productName: { $regex: "(?i)" + search + "(?-i)" },
            },
            {
              status: "active",
            },
            categoryFilter,
            brandFilter,
            highlightFilter,
            subCategoryFilter,
            {
              $or: [
                {
                  price: {
                    $gte: minRange,
                    $lte: maxRange,
                  },
                },
                {
                  offerPrice: {
                    $gte: minRange,
                    $lte: maxRange,
                  },
                },
              ],
            },
          ],
        },
      },
    ]);

    return { sellerData: seller, filteredProducts: filteredProducts };
  }

  //   async findAll(): Promise<ProductDocument[]> {
  //   const allProductData = await this.productModel.find();
  //   return allProductData;
  // }

  //    async findOne(slug: string) {
  //   return this.productModel.findOne({ slug });
  async findAll(
    query: any // : Promise<ProductDocument[]>
  ) {
    const allProductData = await this.productModel.find();
    // let limit: number = parseInt(query.limit) || 3
    // const page: number = parseInt(query.page) || 1
    const featuredProducts = await this.productModel
      .find({ isFeatured: true, status: "active" }, { _id: 0 })
      // .limit(limit)
      .sort({ createdAt: "asc" })
      .exec();

    const topProducts = await this.productModel
      .find({ isTopProduct: true, status: "active" }, { _id: 0 })
      // .limit(limit)
      .sort({ createdAt: "asc" })
      .exec();

    const newProducts = await this.productModel
      .find({ isNewArrival: true, status: "active" }, { _id: 0 })
      // .limit(limit)
      .sort({ createdAt: "asc" })
      .exec();

    const bestProducts = await this.productModel
      .find({ isBestProduct: true, status: "active" }, { _id: 0 })
      // .limit(limit)
      .sort({ createdAt: "asc" })
      .exec();

    const popularProducts = await this.productModel
      .find({ isPopular: true, status: "active" }, { _id: 0 })
      // .limit(limit)
      .sort({ createdAt: "asc" })
      .exec();

    return {
      featuredProducts,
      topProducts,
      popularProducts,
      bestProducts,
      newProducts,
      allProductData,
    };
  }

  async findAllAdminProducts(
    query: any // : Promise<ProductDocument[]>
  ) {
    const allProductData = await this.productModel
      .find({ productName: new RegExp(query.search, "i") })
      .sort({ [query.sortBy]: query.sortType });

    // const allProductData = await serviceHandler.queryHandler(
    //   this.productModel,
    //   query
    // );

    // let limit: number = parseInt(query.limit) || 3
    // const page: number = parseInt(query.page) || 1

    const stockOutProducts = await this.productModel
      .find({ stock: 0, productName: new RegExp(query.search, "i") })
      .sort({ [query.sortBy]: query.sortType });

    const sellerProducts = await this.productModel
      .find({ addedBy: "seller", productName: new RegExp(query.search, "i") })
      .sort({ [query.sortBy]: query.sortType });

    const sellerPendingProducts = await this.productModel
      .find({
        addedBy: "seller",
        approvalStatus: "pending",
        productName: new RegExp(query.search, "i"),
      })
      .sort({ [query.sortBy]: query.sortType });
    return {
      allProductData,
      stockOutProducts,
      sellerProducts,
      sellerPendingProducts,
    };
  }

  async findAllSellerProducts(
    slug: string,
    query: any // : Promise<ProductDocument[]>
  ) {
    const allProductData = await this.productModel
      .find({ productName: new RegExp(query.search, "i"), seller_slug: slug })
      .sort({ [query.sortBy]: query.sortType });

    // const allProductData = await serviceHandler.queryHandler(
    //   this.productModel,
    //   query
    // );

    // let limit: number = parseInt(query.limit) || 3
    // const page: number = parseInt(query.page) || 1

    const stockOutProducts = await this.productModel
      .find({
        stock: 0,
        productName: new RegExp(query.search, "i"),
        seller_slug: slug,
      })
      .sort({ [query.sortBy]: query.sortType });

    // const sellerProducts = await this.productModel
    //   .find({ addedBy: "seller", productName: new RegExp(query.search, "i") })
    //   .sort({ [query.sortBy]: query.sortType });

    const sellerPendingProducts = await this.productModel
      .find({
        addedBy: "seller",
        approvalStatus: "pending",
        productName: new RegExp(query.search, "i"),
        seller_slug: slug,
      })
      .sort({ [query.sortBy]: query.sortType });
    return {
      allProductData,
      stockOutProducts,
      // sellerProducts,
      sellerPendingProducts,
    };
  }

  async findOne(slug: string) {
    return this.productModel.findOne({ slug });
  }

  async update(
    slug: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    // const result = await this.model.findByIdAndUpdate(id, updateProductDto);
    const result = await this.productModel.findOneAndUpdate(
      { slug: slug },
      updateProductDto,
      { new: true }
    );
    return result;
  }

  async delete(slug: string): Promise<Product> {
    return await this.productModel.findOneAndDelete({ slug });
  }

  async getProductsInventory(query: SearchSortDto): Promise<Product[]> {
    // to get stock data since last month
    var d = new Date();
    d.setMonth(d.getMonth() - 1);

    const result = await this.productModel.aggregate([
      {
        $match: {
          productName: {
            $regex: "(?i)" + query.search + "(?-i)",
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
          from: "inventories",
          localField: "slug",
          foreignField: "product_slug",
          as: "stockData",
          pipeline: [
            {
              $match: {
                createdAt: {
                  $gte: d,
                },
              },
            },
            {
              $group: {
                _id: "$type",
                totalCount: {
                  $sum: "$quantity",
                },
                all_data: { $addToSet: "$$ROOT" },
              },
            },
          ],
        },
      },
    ]);

    return result;
  }

  async getSellerProductsInventory(
    seller_slug: string,
    query: SearchSortDto
  ): Promise<Product[]> {
    // to get stock data since last month
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    const result = await this.productModel.aggregate([
      {
        $match: {
          seller_slug: seller_slug,
          productName: {
            $regex: "(?i)" + query.search + "(?-i)",
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
          from: "inventories",
          localField: "slug",
          foreignField: "product_slug",
          as: "stockData",
          pipeline: [
            {
              $match: {
                createdAt: {
                  $gte: d,
                },
              },
            },
            {
              $group: {
                _id: "$type",
                totalCount: {
                  $sum: "$quantity",
                },
                all_data: { $addToSet: "$$ROOT" },
              },
            },
          ],
        },
      },
    ]);

    return result;
  }

  // .find({
  //   product_slug: slug,
  //   quantity: new RegExp(query.search, "i"),
  //   type: "stockIn",
  // })
  // .sort({ [query.sortBy]: query.sortType });

  async getSingleProductsInventory(slug: string, query: any) {
    console.log(query);
    const result = await this.productModel.aggregate([
      {
        $match: {
          slug: {
            $regex: "(?i)" + slug + "(?-i)",
          },
          // quantity: {
          //   $regex: "(?i)" + query.search + "(?-i)",
          // },
        },
      },

      {
        $lookup: {
          from: "inventories",
          localField: "slug",
          foreignField: "product_slug",
          as: "stockInData",
          pipeline: [
            {
              $match: {
                type: "stockIn",
              },
            },
            // {
            //   $sort: { [query.sortBy]: query.sortType === "asc" ? 1 : -1 },
            // },
          ],
        },
      },
    ]);

    return result[0];
  }
}
