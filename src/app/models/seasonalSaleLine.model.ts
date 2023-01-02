import { ProductItem } from "./productItem.model";

export class SeasonalSaleLine { 
    constructor(
        public seasonalSaleId: number,
        public itemId: number,
        public discountPercentage: number,
        public productItem?: ProductItem,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}