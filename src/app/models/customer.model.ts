import { Order } from "./order.model";

export class Customer {
    constructor(
        public firstName: string,
        public email: string,
        public password: string,
        public lastName: string,
        public streetAddress: string,
        public phoneNumber: string,
        public orders?: Array<Order>, 
        public id?: number,
        public created_at?: string,
        public updated_at?: string   
    ){}
}
