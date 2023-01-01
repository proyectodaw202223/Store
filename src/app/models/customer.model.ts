export class Customer { 
    constructor(
        public firstName: string,
        public email: string,
        public password: string,
        public lastName: string = 'no',
        public address: string = 'no',
        public phoneNumber: number = 111111111,
        public id?: number,
        public created_at?: string,
        public updated_at?: string      
    ){}
}
