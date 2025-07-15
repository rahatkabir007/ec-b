import { Module } from "@nestjs/common";
import { FlashSaleService } from "./flash_sale.service";
import { FlashSaleController } from "./flash_sale.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { FlashSale, FlashSaleSchema } from "../../schemas/flash_sale.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashSale.name, schema: FlashSaleSchema },
    ]),
  ],
  controllers: [FlashSaleController],
  providers: [FlashSaleService],
})
export class FlashSaleModule { }
