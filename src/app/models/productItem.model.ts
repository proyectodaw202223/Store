import { Product } from "./product.model";
import { ProductItemImage } from "./productItemImage.model";
import { SeasonalSale } from "./seasonalSale.model";

export class ProductItem { 
    constructor(
        public productId: number,
        public color: string,
        public stock: number,
        public size: string,
        public images: Array<ProductItemImage> = [],
        public product?: Product,
        public sale?: SeasonalSale,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}
