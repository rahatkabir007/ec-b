import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from 'src/schemas/image.schema';

@Injectable()
export class UploadService {
    constructor(
        @InjectModel(Image.name)
        private readonly imageModel: Model<Image>,
    ) { }

    async saveImage(url: string): Promise<Image> {
        const image = new this.imageModel({ url });
        return image.save();
    }
}