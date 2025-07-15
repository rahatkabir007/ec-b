import { Module } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { SellerController } from "./seller.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Seller, SellerSchema } from "../../schemas/seller.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }]),
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule { }
