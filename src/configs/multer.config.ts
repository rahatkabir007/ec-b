import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
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
};