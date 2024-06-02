import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true })
  slug: string;

  @Prop()
  user_slug: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  country: string;

  @Prop()
  division: string;

  // @Prop()
  // state: string;
  @Prop()
  district: string;

  // @Prop()
  // city: string;

  @Prop()
  thana: string;

  @Prop()
  address: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
