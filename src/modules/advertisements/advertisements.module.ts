import { Module } from "@nestjs/common";
import { AdvertisementsService } from "./advertisements.service";
import { AdvertisementsController } from "./advertisements.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Advertisement,
  AdvertisementSchema,
} from "../../schemas/advertisement.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Advertisement.name, schema: AdvertisementSchema },
    ]),
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService],
})
export class AdvertisementsModule { }
