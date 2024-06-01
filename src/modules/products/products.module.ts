import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product, ProductSchema } from "src/schemas/product.schema";
import { User, UserSchema } from "src/schemas/user.schema";
import { UploadService } from "../upload/upload.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, UploadService],
})
export class ProductsModule {}
