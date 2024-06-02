import { IsString, IsOptional } from "class-validator";

export class RegisterUserDto {
  @IsString({ message: "should be string" })
  email: string;

  @IsString({ message: "should be string" })
  fullName: string;

  @IsString({ message: "should be string" })
  role: string;

  @IsOptional()
  @IsString({ message: "should be string token" })
  tokenType: "facebook" | "google" | "email";

  @IsOptional()
  @IsString({ message: "should be string" })
  avatar: string;

  @IsOptional()
  @IsString({ message: "should be string" })
  status: string;
}
