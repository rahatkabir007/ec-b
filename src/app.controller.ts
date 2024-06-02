import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from "./app.service";
import { CategoriesService } from "./modules/categories/categories.service";
import { BrandsService } from "./modules/brands/brands.service";
import { SubCategoriesService } from "./modules/sub-categories/sub-categories.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("wo-user")
  getAllDataWoUser() {
    return this.appService.getAllDataWoUser();
  }

  @Get("with-user/:slug")
  getAllDataWithUser(@Param("slug") slug: string) {
    return this.appService.getAllDataWithUser(slug);
  }

  @Get("home")
  getHomePageData() {
    return this.appService.getHomePageData();
  }
}
