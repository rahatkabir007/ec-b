import { Module } from "@nestjs/common";
import { SeoService } from "./seo.service";
import { SeoController } from "./seo.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Seo, SeoSchema } from "../../schemas/seo.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Seo.name, schema: SeoSchema }])],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule { }
