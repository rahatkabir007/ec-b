import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "../../schemas/order.schema";
import { Inventory, InventorySchema } from "../../schemas/inventory.schema";
import { Product } from "../products/entities/product.entity";
import { ProductSchema } from "../../schemas/product.schema";
import { Cart, CartSchema } from "../../schemas/cart.schema";
import { Coupon, CouponSchema } from "../../schemas/coupon.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Coupon.name, schema: CouponSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
