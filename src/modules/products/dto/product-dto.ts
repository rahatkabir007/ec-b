import {
    IsString,
} from 'class-validator';

export class ProductDto {

    @IsString()
    data: string;
}
