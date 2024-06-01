import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    getMulterConfig() {
        return {
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
    }

    handleFileUpload(files) {
        return files.map(file => {
            const url = `${process.env.API_URL}/${file.originalname}`;
            return { id: file.originalname.split('-')[0], url };
        });
    }
}