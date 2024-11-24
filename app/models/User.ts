export interface IUser {
    id: string, 
    full_name: string,
    email: string,
    password: string,
    birthdate: string,
    ssn: string,
    permission?: number,
    created_at: string,
    updated_at: string
}