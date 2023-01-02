import { Customer } from "./customer.model";
import { OrderLine } from "./orderLine.model";

export class Order { 
    constructor(
        public customerId: number,
        public amount: number,
        public paymentDateTime: string,
        public comments: string,
        public status: string,
        public customer?: Customer,
        public lines?: Array<OrderLine>,
        public id?: number,
        public created_at?: string,
        public updated_at?: string
    ){}
}
