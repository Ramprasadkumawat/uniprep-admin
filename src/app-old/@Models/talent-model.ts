export interface TalentEmployerResponse {
    status: string
    data: TalentEmployer[]
    count: number
    total_count: number
}

export interface TalentEmployer {
    id: number
    name: string
    email: string
    usertype: string
    location_id: number
    country_id: number
    gender: string
    company_id: any
    company_name: string
    company_website: string
    company_designation: string
    phone_country_code: any
    phone: string
    job_posting: number
    status: string
    logintime: any
    comments: any
    last_logintime: any
    total_active_hours: string
    location: string
    company_size_id: number,
    status_option: any,
    follow_date: any,
    follow_time: any,
    approved_at: any,
    rejected_at: any,
    source_type: any,
    source_name: any
}

export interface ExportEmployeeRes {
    status: string
    message: string
    file: string
}

export interface CompanySize {
    id: number
    size: string
    status: number
    created_at: any
    updated_at: any
}
