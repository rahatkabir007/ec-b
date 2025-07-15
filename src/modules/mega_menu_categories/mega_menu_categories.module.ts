import { Module } from '@nestjs/common';
import { MegaMenuCategoriesService } from './mega_menu_categories.service';
import { MegaMenuCategoriesController } from './mega_menu_categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MegaCategories, MegaCategoriesSchema } from '../../schemas/mega_menu_categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MegaCategories.name, schema: MegaCategoriesSchema }]),
  ],
  controllers: [MegaMenuCategoriesController],
  providers: [MegaMenuCategoriesService]
})
export class MegaMenuCategoriesModule { }
