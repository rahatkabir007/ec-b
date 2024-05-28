import { Controller, Post, UploadedFiles, UseInterceptors, Req, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    @UseInterceptors(FilesInterceptor('image', 20, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                // const uniqueName = `${uuidv4()}-${file.originalname}`;
                // cb(null, uniqueName);
                cb(null, file.originalname);
            },
        }),
        limits: {
            fileSize: 5000000, // limit file size to 5MB
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                // reject file if it's not an image
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    }))
    async uploadImage(@UploadedFiles() files, @Req() req: Request) {
        const response = files.map(file => {
            const url = `${process.env.API_URL}/${file.originalname}`;
            return { id: file.originalname.split('-')[0], url };
        });
        // console.log(response);
        return response;
    }
}