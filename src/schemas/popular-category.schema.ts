import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PopularCategoryDocument = PopularCategory & Document;

@Schema({ timestamps: true })
export class PopularCategory {
  @Prop({ default: "category_slug_1", required: true })
  slug: string;

  // @Prop({ required: true })
  // cat_name: string;

  @Prop()
  cat_image: string;

  @Prop()
  cat_slug: string;

  // @Prop({ required: true })
  // cat_status: string;

  // @Prop({ required: true })
  // cat_icon: string;
}

export const PopularCategorySchema =
  SchemaFactory.createForClass(PopularCategory);
