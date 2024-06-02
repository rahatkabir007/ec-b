import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { SubscriberService } from "./subscriber.service";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { UpdateSubscriberDto } from "./dto/update-subscriber.dto";
import { SearchSortDto } from "src/utils/all-queries.dto";
import { MailgunService } from "../mailgun/mailgun.service";

@Controller("subscriber")
export class SubscriberController {
  constructor(
    private readonly subscriberService: SubscriberService,
    private readonly mailgunService: MailgunService
  ) {}

  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscriberService.create(createSubscriberDto);
  }
  // ----

  @Post("send-email")
  async sendEmail(@Body() emailData: any) {
    const subscribers = await this.subscriberService.findAllForCoupon();
    let subscriberEmail = subscribers.map((sub) => sub.email);
    const data = {
      from: "iamiqbalcse27@gmail.com",
      to: subscriberEmail,
      subject: emailData.subject,
      text: emailData.message,
    };
    return await this.mailgunService.sendEmail(data);
  }

  //..............
  @Get()
  async findAll(@Query() query: SearchSortDto) {
    return await this.subscriberService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subscriberService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto
  ) {
    return this.subscriberService.update(+id, updateSubscriberDto);
  }

  @Delete(":slug")
  delete(@Param("slug") slug: string) {
    return this.subscriberService.delete(slug);
  }
}
