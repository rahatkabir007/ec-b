import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { QueryDto } from "./dto/query.dto";
import { SearchSortDto } from "src/utils/all-queries.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() queries: QueryDto, @Request() req: Request) {
    return await this.productsService.findAll(queries);
  }

  @Get("/filter")
  findFilteredProducts(
    @Query()
    query: {
      search: string;
      categories: string;
      sub_category: string;
      brands: string;
      highlight: string;
      max: string;
      min: string;
    },
    @Request() req: Request
  ) {
    console.log("🚀 ~ file: products.controller.ts:46 ~ ProductsController ~ query:", query)
    return this.productsService.findFilteredProducts(query);
  }

  @Get("/filter-by-shop/:shopName")
  findFilteredProductsBySeller(
    @Param("shopName") shopName: string,
    @Query()
    query: {
      search: string;
      categories: string;
      sub_category: string;
      brands: string;
      highlight: string;
      max: string;
      min: string;
    },
    @Request() req: Request
  ) {
    console.log(shopName, query);
    return this.productsService.findFilteredProductsBySeller(shopName, query);
  }

  //..............
  // @Get("/seller")
  // async findAllSellerWithProduct(
  //   @Param("slug") slug: string,
  //   @Request() req: Request
  // ) {
  //   return await this.productsService.findWithSeller(slug);
  // }
  //..............
  @Get("/admin")
  async findAllAdminProduct(@Query() query: SearchSortDto) {
    return await this.productsService.findAllAdminProducts(query);
  }

  @Get("seller/:slug")
  async findAllSellerProducts(
    @Param("slug") slug: string,
    @Query() query: SearchSortDto
  ) {
    return await this.productsService.findAllSellerProducts(slug, query);
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.productsService.findOne(slug);
  }

  @Patch(":slug")
  update(
    @Param("slug") slug: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(slug, updateProductDto);
  }

  @Delete(":slug")
  delete(@Param("slug") slug: string) {
    return this.productsService.delete(slug);
  }

  @Get("/admin/get-inventories")
  getProductsInventory(@Query() query: SearchSortDto) {
    return this.productsService.getProductsInventory(query);
  }

  @Get("/seller/get-inventories/:slug")
  getSellerProductsInventory(
    @Param("slug") seller_slug: string,
    @Query() query: SearchSortDto
  ) {
    return this.productsService.getSellerProductsInventory(seller_slug, query);
  }

  @Get("/get-inventory/:slug")
  getSingleProductInventory(
    @Param("slug") slug: string,
    @Query() query: SearchSortDto
  ) {
    return this.productsService.getSingleProductsInventory(slug, query);
  }

  @Get("/admin/related/:catSlug")
  async findByCatSlug(@Param("catSlug") catSlug: string) {
    return this.productsService.getRelatedProducts(catSlug);
  }
}
