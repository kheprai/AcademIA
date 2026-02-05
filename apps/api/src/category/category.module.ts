import { Module } from "@nestjs/common";

import { LocalizationModule } from "src/localization/localization.module";
import { LocalizationService } from "src/localization/localization.service";
import { S3Module } from "src/s3/s3.module";

import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [LocalizationModule, S3Module],
  controllers: [CategoryController],
  providers: [CategoryService, LocalizationService],
  exports: [],
})
export class CategoryModule {}
