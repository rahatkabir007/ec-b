import { Injectable } from "@nestjs/common";
//@ts-ignore
import * as mailgun from "mailgun-js";

@Injectable()
export class MailgunService {
  private mg;

  constructor() {
    this.mg = mailgun({
      //iamiqbalcse27@gmail.com 'to' account
      apiKey: "cadd62ff366ee740a0981ad1906c9c9a-6b161b0a-7c371523",
      domain: "sandboxb9ffd98b1f8247769ae580de08873db2.mailgun.org",
    });
  }

  sendEmail(data) {
    return this.mg.messages().send(data);
  }
}
