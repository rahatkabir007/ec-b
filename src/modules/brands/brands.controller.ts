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
import { Brand } from "../../schemas/brand.schema";
import { BrandsService } from "./brands.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { NewBrand } from "./entities/brand.entity";
import { SearchSortDto } from "./../../utils/all-queries.dto";

@Controller("brands")
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  findAll(@Query() query: SearchSortDto): Promise<NewBrand[]> {
    return this.brandsService.findAll(query);
  }

  @Get("/allbrands")
  findAllBrand(): Promise<NewBrand[]> {
    return this.brandsService.findAllBrand();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.brandsService.findOne(slug);
  }

  @Patch(":slug")
  update(@Param("slug") slug: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(slug, updateBrandDto);
  }

  @Delete(":slug")
  remove(@Param("slug") slug: string) {
    return this.brandsService.remove(slug);
  }
}
