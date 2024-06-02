import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  catSlug: string;

  @Prop()
  subCatSlug: string;

  @Prop()
  brandSlug: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ default: "inactive" })
  status: string;

  @Prop({ required: true })
  imageURL: Array<string>;

  @Prop()
  offerPrice: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  weight: number;

  @Prop()
  seoTitle: string;

  @Prop()
  seoDescription: string;

  @Prop({ default: false })
  isTopProduct: boolean;

  @Prop({ default: false })
  isNewArrival: boolean;

  @Prop({ default: false })
  isBestProduct: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop()
  addedBy: string;

  @Prop({ default: "pending" })
  approvalStatus: string;

  @Prop()
  seller_slug: string;

  @Prop({ default: 0 })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
