import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchSortDto {
  @IsString()
  @IsOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  sortType: string;

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  order_status: string;

  @IsString()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  page: number;
}
