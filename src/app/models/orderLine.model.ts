import { ProductItem } from "./productItem.model";

export class OrderLine {
    constructor(
        public orderId: number,
        public itemId: number,
        public quantity: number,
        public priceWithDiscount: number,
        public amount: number,
        public productItem?: ProductItem,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}
