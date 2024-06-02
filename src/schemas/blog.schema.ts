import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  slug: string;

  @Prop()
  imageURL: string;

  @Prop()
  title: string;

  @Prop()
  category_slug: string;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  long_description: string;

  @Prop()
  isShowHomepage: string;

  @Prop()
  status: string;

  @Prop()
  seo_title: string;

  @Prop()
  seo_description: string;

  @Prop()
  postBy: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
