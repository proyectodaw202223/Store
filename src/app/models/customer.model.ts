export class Customer { 
    constructor(
        public firstName: string,
        public email: string,
        public password: string,
        public lastName?: string,
        public country?: string,
        public province?: string,
        public city?: string,
        public zipCode?: string,
        public streetAddress?: string,
        public phoneNumber?: number,
        public id?: number,
        public created_at?: string,
        public updated_at?: string      
    ){}
}
