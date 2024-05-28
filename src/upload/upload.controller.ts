import { Controller, Post, UploadedFile, UseInterceptors, Req, BadRequestException } from '@nestjs/common';
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
        limits: {
            fileSize: 5000000, // limit file size to 2MB
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                // reject file if it's not an image
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    }))
    async uploadImage(@UploadedFile() file, @Req() req: Request) {
        const url = `${process.env.API_URL}/${file.filename}`;
        console.log(url);
        return { url };
    }
}