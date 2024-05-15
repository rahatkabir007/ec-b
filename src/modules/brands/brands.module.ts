import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { BrandsService } from "./brands.service";
import { BrandsController } from "./brands.controller";
import { Brand, BrandSchema } from "src/schemas/brand.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]), 
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
