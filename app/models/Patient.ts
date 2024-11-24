export interface IPatient {
    id: string,
    full_name: string,
    birthdate: Date | null,
    ssn: string,
    contact_number: string,
    email: string,
    medical_history: string ,
    address: string ,
    gender: string ,
    has_insurance: boolean | null,
    insurance_carrier?: string | null,
    user_id: string | null,
    created_at?: string,
    updated_at?: string,
    profile_picture_url?: string
}
