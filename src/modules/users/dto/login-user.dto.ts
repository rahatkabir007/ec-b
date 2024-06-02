import {
  IsInt,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class LoginUserDto {
  @IsOptional()
  @IsString({ message: "should be string email" })
  email: string;

  @IsOptional()
  fullName: string | null;

  @IsOptional()
  @IsString({ message: "should be string token" })
  token: string;

  @IsOptional()
  @IsString({ message: "should be string token" })
  tokenType: "facebook" | "google" | "email";

  @IsOptional()
  @IsString({ message: "should be string" })
  avatar: string;

  // @IsString({ message: 'should be string' })
  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  status: string;

  // @IsString({ message: 'should be string' })
  // userType: string
}
