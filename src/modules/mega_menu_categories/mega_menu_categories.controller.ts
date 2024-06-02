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
import { MegaMenuCategoriesService } from "./mega_menu_categories.service";
import { CreateMegaMenuCategoryDto } from "./dto/create-mega_menu_category.dto";
import { UpdateMegaMenuCategoryDto } from "./dto/update-mega_menu_category.dto";
import { SearchSortDto } from "src/utils/all-queries.dto";

@Controller("mega-menu-categories")
export class MegaMenuCategoriesController {
  constructor(
    private readonly megaMenuCategoriesService: MegaMenuCategoriesService
  ) {}

  @Post()
  create(@Body() createMegaMenuCategoryDto: CreateMegaMenuCategoryDto) {
    return this.megaMenuCategoriesService.create(createMegaMenuCategoryDto);
  }

  @Get("/header")
  findAllForHeader() {
    return this.megaMenuCategoriesService.findAllForHeader();
  }

  @Get()
  findAll(@Query() query: SearchSortDto) {
    return this.megaMenuCategoriesService.findAll(query);
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.megaMenuCategoriesService.findOne(slug);
  }

  @Patch(":slug")
  update(
    @Param("slug") slug: string,
    @Body() updateMegaMenuCategoryDto: UpdateMegaMenuCategoryDto
  ) {
    return this.megaMenuCategoriesService.update(
      slug,
      updateMegaMenuCategoryDto
    );
  }

  @Delete(":slug")
  remove(@Param("slug") slug: string) {
    return this.megaMenuCategoriesService.remove(slug);
  }
}
