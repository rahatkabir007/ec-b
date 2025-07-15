import { Module } from "@nestjs/common";
import { ReporteditemsService } from "./reporteditems.service";
import { ReporteditemsController } from "./reporteditems.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ReportedItem,
  ReportedItemSchema,
} from "../../schemas/reported-item.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportedItem.name, schema: ReportedItemSchema },
    ]),
  ],
  controllers: [ReporteditemsController],
  providers: [ReporteditemsService],
})
export class ReporteditemsModule { }
