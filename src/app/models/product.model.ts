import { ProductItem } from "./productItem.model";

export class Product { 
    constructor(
        public name: string,
        public description: string,
        public price: number,
        public category: string,
        public subcategory: string,
        public productItems: Array<ProductItem>,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}
