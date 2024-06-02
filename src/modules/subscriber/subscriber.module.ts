import { Module } from "@nestjs/common";
import { SubscriberService } from "./subscriber.service";
import { SubscriberController } from "./subscriber.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Subscriber, SubscriberSchema } from "src/schemas/subscriber.schema";
import { MailgunService } from "../mailgun/mailgun.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
    ]),
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService, MailgunService],
})
export class SubscriberModule {}
//MailgunService ,
