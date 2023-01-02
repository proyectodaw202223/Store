export class User { 
    constructor(
        public email: string,
        public password: string,
        public role: string,
        public id?: number,
        public created_at?: string,
        public updated_at?: string      
    ){}
}
