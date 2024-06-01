import { Controller, Post, UploadedFiles, UseInterceptors, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Request } from 'express';
import { multerConfig } from 'src/configs/multer.config';


@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('image', 20, multerConfig))
    async uploadImage(@UploadedFiles() files, @Req() req: Request) {
        return this.uploadService.handleFileUpload(files);
    }
}