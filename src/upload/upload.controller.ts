import { Controller, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { Request } from 'express';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            },
        }),
    }))
    async uploadImage(@UploadedFile() file, @Req() req: Request) {
        
        const url = `${process.env.API_URL}/${file.filename}`;
        console.log(url);
        return { url };
    }
}