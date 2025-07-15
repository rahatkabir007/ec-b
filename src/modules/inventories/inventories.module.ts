import { Module } from "@nestjs/common";
import { InventoriesService } from "./inventories.service";
import { InventoriesController } from "./inventories.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Inventory, InventorySchema } from "../../schemas/inventory.schema";
import { Product, ProductSchema } from "../../schemas/product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService],
})
export class InventoriesModule { }
