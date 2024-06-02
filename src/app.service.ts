import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "./schemas/category.schema";
import { Model } from "mongoose";
import { Brand, BrandDocument } from "./schemas/brand.schema";
import {
  SubCategories,
  SubCategoriesDocument,
} from "./schemas/sub-category.schema";
import { Cart, CartDocument } from "./schemas/cart.schema";
import { Wishlist, WishlistDocument } from "./schemas/wishlist.schema";
import { User, UserDocument } from "./schemas/user.schema";
import { Slider, SliderDocument } from "./schemas/slider.schema";
import {
  Advertisement,
  AdvertisementDocument,
} from "./schemas/advertisement.schema";
import {
  PopularCategory,
  PopularCategoryDocument,
} from "./schemas/popular-category.schema";
import { FlashSale, FlashSaleDocument } from "./schemas/flash_sale.schema";
import {
  FeaturedCategory,
  FeaturedCategoryDocument,
} from "./schemas/featured-category.schema";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(SubCategories.name)
    private readonly subCategoryModel: Model<SubCategoriesDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Slider.name)
    private readonly sliderModel: Model<SliderDocument>,
    @InjectModel(Advertisement.name)
    private advertisementModel: Model<AdvertisementDocument>,
    @InjectModel(PopularCategory.name)
    private readonly popularCategoryModel: Model<PopularCategoryDocument>,
    @InjectModel(FlashSale.name)
    private readonly flashSaleModel: Model<FlashSaleDocument>,
    @InjectModel(FeaturedCategory.name)
    private readonly featuredCategoryModel: Model<FeaturedCategoryDocument>
  ) {}

  getHello(): string {
    return "Hello World!";
  }

  getCats = new Promise((resolve, reject) => {
    const c1 = async () => {
      const categories = await this.categoryModel.find({
        cat_status: "active",
      });
      resolve(categories);
    };
    c1();
  });

  getBrands = new Promise((resolve, reject) => {
    const c1 = async () => {
      const brands = await this.brandModel.find({ status: "active" });
      resolve(brands);
    };
    c1();
  });

  getSubCats = new Promise((resolve, reject) => {
    const c1 = async () => {
      const subCats = await this.subCategoryModel.find({
        subcat_status: "active",
      });
      resolve(subCats);
    };
    c1();
  });

  async getAllDataWoUser() {
    const allData = await Promise.all([
      this.getCats,
      this.getBrands,
      this.getSubCats,
    ]);
    return {
      categories: allData[0],
      brands: allData[1],
      subCategories: allData[2],
    };
  }

  async getAllDataWithUser(slug: string) {
    const getSingleUser = new Promise((resolve, reject) => {
      const c1 = async () => {
        const user = await this.userModel.findOne({ slug: slug });
        resolve(user);
      };
      c1();
    });

    const getUserCart = new Promise((resolve, reject) => {
      const c1 = async () => {
        const cart = this.cartModel.aggregate([
          {
            $match: {
              user_slug: slug,
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
        resolve(cart);
      };
      c1();
    });

    const getUserWishlist = new Promise((resolve, reject) => {
      const c1 = async () => {
        const wishlist = await this.wishlistModel.aggregate([
          {
            $match: {
              user_slug: slug,
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ]);
        resolve(wishlist);
      };
      c1();
    });

    const allData = await Promise.all([
      this.getCats,
      this.getBrands,
      this.getSubCats,
      getSingleUser,
      getUserCart,
      getUserWishlist,
    ]);

    return {
      categories: allData[0],
      brands: allData[1],
      subCategories: allData[2],
      user: allData[3],
      cart: allData[4],
      wishlist: allData[5],
    };
  }

  async getHomePageData() {
    const getSliders = new Promise((resolve, reject) => {
      const c1 = async () => {
        const sliders = await this.sliderModel
          .find({ status: "active" })
          .sort({ serial: 1 });
        resolve(sliders);
      };
      c1();
    });

    const getSliderOne = new Promise((resolve, reject) => {
      const c1 = async () => {
        const ad = await this.advertisementModel.findOne({
          adName: "Slider Banner One",
          status: "active",
        });
        resolve(ad);
      };
      c1();
    });

    const getSliderTwo = new Promise((resolve, reject) => {
      const c1 = async () => {
        const ad = await this.advertisementModel.findOne({
          adName: "Slider Banner Two",
          status: "active",
        });
        resolve(ad);
      };
      c1();
    });

    const getPopCats = new Promise((resolve, reject) => {
      const c1 = async () => {
        const popCats = await this.popularCategoryModel.aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "cat_slug",
              foreignField: "cat_slug",
              as: "categoriesData",
            },
          },
          {
            $unwind: "$categoriesData",
          },
        ]);
        resolve(popCats);
      };
      c1();
    });

    const getFlashSale = new Promise((resolve, reject) => {
      const c1 = async () => {
        const fs = await this.flashSaleModel.findOne({ name: "flashcontnet" });
        resolve(fs);
      };
      c1();
    });

    const getFeatCats = new Promise((resolve, reject) => {
      const c1 = async () => {
        const popCats = await this.featuredCategoryModel.aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "cat_slug",
              foreignField: "cat_slug",
              as: "categoriesData",
            },
          },
          {
            $unwind: "$categoriesData",
          },
        ]);
        resolve(popCats);
      };
      c1();
    });

    const getAdTwo = new Promise((resolve, reject) => {
      const c1 = async () => {
        const ad = await this.advertisementModel.findOne({
          adName: "Homepage Single Banner One",
          status: "active",
        });
        resolve(ad);
      };
      c1();
    });

    const getAdThree = new Promise((resolve, reject) => {
      const c1 = async () => {
        const ad = await this.advertisementModel.findOne({
          adName: "Homepage Single Banner Two",
          status: "active",
        });
        resolve(ad);
      };
      c1();
    });

    const allData = await Promise.all([
      getSliders,
      getSliderOne,
      getSliderTwo,
      getPopCats,
      getFlashSale,
      getFeatCats,
      getAdTwo,
      getAdThree,
    ]);

    return {
      sliders: allData[0],
      sliderOne: allData[1],
      sliderTwo: allData[2],
      popularCategories: allData[3],
      flashSale: allData[4],
      featuredCategories: allData[5],
      adOne: allData[6],
      adTwo: allData[7],
    };
  }
}
