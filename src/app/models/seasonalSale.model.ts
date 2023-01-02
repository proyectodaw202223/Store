import { SeasonalSaleLine } from "./seasonalSaleLine.model";

export class SeasonalSale { 
    constructor(
        public slogan: string,
        public description: string,
        public validFromDateTime: string,
        public validToDateTime: string,
        public isCanceled: boolean,
        public canceledAtDateTime: string,
        public lines?: Array<SeasonalSaleLine>,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}