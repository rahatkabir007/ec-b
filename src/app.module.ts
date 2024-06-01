import { BlogCommentsModule } from "./modules/blog_comments/blog_comments.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { ProductsModule } from "./modules/products/products.module";
import { WishlistModule } from "./modules/wishlist/wishlist.module";
import { CartModule } from "./modules/cart/cart.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { SubCategoriesModule } from "./modules/sub-categories/sub-categories.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { BrandsModule } from "./modules/brands/brands.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PopularCategoriesModule } from "./modules/popular_categories/popular_categories.module";
import { ReporteditemsModule } from "./modules/reporteditems/reporteditems.module";
import { AddressesModule } from "./modules/addresses/addresses.module";
import { CouponModule } from "./modules/coupon/coupon.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { SliderModule } from "./modules/slider/slider.module";
import { AdvertisementsModule } from "./modules/advertisements/advertisements.module";
import { MegaMenuCategoriesModule } from "./modules/mega_menu_categories/mega_menu_categories.module";
import { FeaturedCategoriesModule } from "./modules/featured_categories/featured_categories.module";
import { InventoriesModule } from "./modules/inventories/inventories.module";
import { SellerModule } from "./modules/seller/seller.module";
import { WithdrawsModule } from "./modules/withdraws/withdraws.module";
import { WithdrawMethodsModule } from "./modules/withdraw_methods/withdraw_methods.module";
import { BlogsModule } from "./modules/blogs/blogs.module";
import { FlashSaleModule } from "./modules/flash_sale/flash_sale.module";
import { SeoModule } from "./modules/seo/seo.module";
import { BlogCategoryModule } from "./modules/blog-category/blog-category.module";
import { SubscriberModule } from "./modules/subscriber/subscriber.module";
import { UploadModule } from "./modules/upload/upload.module";


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL ?? ""),
    UsersModule,
    ProductsModule,
    PopularCategoriesModule,
    WishlistModule,
    CartModule,
    CategoriesModule,
    SubCategoriesModule,
    ReviewsModule,
    BrandsModule,
    OrdersModule,
    PaymentsModule,
    ReporteditemsModule,
    AddressesModule,
    CouponModule,
    DashboardModule,
    SliderModule,
    AdvertisementsModule,
    MegaMenuCategoriesModule,
    FeaturedCategoriesModule,
    InventoriesModule,
    SellerModule,
    FlashSaleModule,
    SeoModule,
    WithdrawsModule,
    WithdrawMethodsModule,
    BlogsModule,
    BlogCommentsModule,
    BlogCategoryModule,
    SubscriberModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
