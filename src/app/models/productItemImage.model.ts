export class ProductItemImage {
    constructor(
        public itemId: number,
        public imagePath: string,
        public url: string,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}
