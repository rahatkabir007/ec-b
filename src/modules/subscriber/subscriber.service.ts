import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Subscriber, SubscriberDocument } from "src/schemas/subscriber.schema";
import { UtilSlug } from "src/utils/UtilSlug";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { UpdateSubscriberDto } from "./dto/update-subscriber.dto";

@Injectable()
export class SubscriberService {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<SubscriberDocument>
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto): Promise<Object> {
    createSubscriberDto["slug"] = UtilSlug.getUniqueId(
      createSubscriberDto.email
    );
    return await new this.subscriberModel(createSubscriberDto).save();
  }

  // ------------- get all subs -------
  async findAll(query: any) {
    const allSubscriber = await this.subscriberModel
      .find({ email: new RegExp(query.search, "i") })
      .sort({ [query.sortBy]: query.sortType });
    return allSubscriber;
  }
  async findAllForCoupon() {
    return await this.subscriberModel.find({});
  }

  // ------------
  // async sendEmail(emailData: any) {
  //   const data = {
  //     from: "iamiqbalcse27@gmail.com",
  //     to: ["kawarib422@glumark.com", "iamhasan9501@gmail.com"],
  //     subject: emailData.subject,
  //     text: emailData.message,
  //   };
  //   return await this.mailgunService.sendEmail(data);
  // }

  // -----------
  findOne(id: number) {
    return `This action returns a #${id} subscriber`;
  }

  update(id: number, updateSubscriberDto: UpdateSubscriberDto) {
    return `This action updates a #${id} subscriber`;
  }

  async delete(slug: string): Promise<Subscriber> {
    return await this.subscriberModel.findOneAndDelete({ slug });
  }
}
