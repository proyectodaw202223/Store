import { Customer } from "./customer.model";
import { OrderLine } from "./orderLine.model";

export class Order { 
    constructor(
        public customerId: number,
        public amount: number,
        public comments: string,
        public status: string,
        public lines?: Array<OrderLine>,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}
