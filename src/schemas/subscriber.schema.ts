import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SubscriberDocument = Subscriber & Document;

@Schema({ timestamps: true })
export class Subscriber {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  email: string;

  @Prop()
  verified?: boolean;

  @Prop()
  user_slug: string;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
