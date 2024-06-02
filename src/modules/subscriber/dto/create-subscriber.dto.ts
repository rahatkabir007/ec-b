import { IsOptional, IsString } from "class-validator";

export class CreateSubscriberDto {
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  verified?: boolean;

  @IsString()
  user_slug: string;
}
