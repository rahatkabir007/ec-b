import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { UserSchema } from "src/schemas/user.schema";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt/dist";
import { Product, ProductSchema } from "src/schemas/product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: `${process.env["JWT_SECRET_KEY"]}`,
      signOptions: { expiresIn: "3000000h" },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
