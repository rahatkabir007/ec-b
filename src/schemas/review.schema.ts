import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop()
  slug: string;

  @Prop()
  order_slug: string;

  @Prop()
  user_slug: string;

  @Prop()
  product_slug: string;

  @Prop()
  seller_slug: string;

  @Prop()
  name: string;

  @Prop()
  message: string;

  @Prop()
  rating: number;

  @Prop()
  status: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
