import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Brand, BrandDocument } from "../../schemas/brand.schema";
import { Category, CategoryDocument } from "../../schemas/category.schema";
import { Order, OrderDocument } from "../../schemas/order.schema";
import { Product, ProductDocument } from "../../schemas/product.schema";
import {
  ReportedItem,
  ReportedItemDocument,
} from "../../schemas/reported-item.schema";
import { Review, ReviewDocument } from "../../schemas/review.schema";
import { User, UserDocument } from "../../schemas/user.schema";
import { CreateDashboardDto } from "./dto/create-dashboard.dto";
import { UpdateDashboardDto } from "./dto/update-dashboard.dto";

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(ReportedItem.name)
    private readonly reportedModel: Model<ReportedItemDocument>
  ) { }
  create(createDashboardDto: CreateDashboardDto) {
    return "This action adds a new dashboard";
  }

  async findAll(query: any) {
    const allOrdersCount = await this.orderModel.countDocuments({});
    const usersCount = await this.userModel.countDocuments({});
    const productCount = await this.productModel.countDocuments({});
    const brandCount = await this.brandModel.countDocuments({});
    const categoryCount = await this.categoryModel.countDocuments({});
    const reviewCount = await this.reviewModel.countDocuments({});
    const reportedCount = await this.reportedModel.countDocuments({});
    const pendingOrdersCount = await this.orderModel.countDocuments({
      order_status: "pending",
    });
    const declinedOrdersCount = await this.orderModel.countDocuments({
      order_status: "declined",
    });
    const completedOrdersCount = await this.orderModel.countDocuments({
      order_status: "completed",
    });

    let match_value = new RegExp(query.search, "i");

    var todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    todayDate.toISOString();

    const todayNewOrders = await this.orderModel.aggregate([
      {
        $match: {
          slug: {
            $regex: match_value,
          },
          createdAt: {
            $gte: todayDate,
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

    const wholeRes = {
      completedOrdersCount: completedOrdersCount,
      declinedOrdersCount: declinedOrdersCount,
      allOrdersCount: allOrdersCount,
      pendingOrdersCount: pendingOrdersCount,
      usersCount: usersCount,
      productCount: productCount,
      brandCount: brandCount,
      categoryCount: categoryCount,
      todayNewOrders: todayNewOrders,
      reviewCount: reviewCount,
      reportedCount: reportedCount,
    };
    return wholeRes;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
