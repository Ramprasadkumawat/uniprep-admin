import { Country } from "./country.model";

export interface ContributionsList {
    isChecked: number
    id: number
    name: string
    details: any
    email: string
    phonenumber: string
    question_answer: any
    totalstudent: number
    payment_id: string
    payment_method: string
    amount: number
    payment_date: Date
    contributiontier: string
    location: string;
    image: any;
}

export interface ContributorsPayLoad {
    page?: number;
    perpage?: number;
    name?: string;
    location?: string;
    contributors_tier?: string;
    total_students?: number;
    payment_method?: string;
    amount?: string;
    payment_date?: Date;
}

export interface ContributorsDetailsResponse {
    contributordetails?: ContributionsList[];
    count?: number;
    message?: string;
    success?: boolean;
}

export interface ContibutorCollege {
    isChecked: number
    id: number
    name: string
    total_student: number
    payment_id: string
    payment_method: string
    amount: number
    payment_date: Date
    contribution_status: string
    location: string;
    image: any;
    pincode: number;
    profile_completion: number;
}

export interface ContributorsCollegeDetailsResponse {
    contributordetails?: ContibutorCollege[];
    count?: number;
    message?: string;
    success?: boolean;
}

export interface SaveResponse {
    message: string;
    success: boolean;
}

export interface ContributorsResponse {
    data?: Contributor[];
    count?: number;
    message?: string;
    success?: boolean;
}
export interface Contributor {
    isChecked: number
    id: number
    name: string
    details: any
    email: string
    phonenumber: string
    question_answer: QuestionAnswer[]
    totalstudent: number
    contributor_id: number
    payment_id: string
    contributor_stable_id: any
    payment_method: string
    amount: string
    payment_time: string
    userstatus: number
    contributiontier: string
    location: string
    image: string
    contributorID: string
    designation: string
    invoice_file_name: string
    invoice_link: string
}

export interface QuestionAnswer {
    question: string
    answer: string
}

export interface Locations {
    id: number
    state: string
    district: string
    country_id: number
    status: number
    created_at: any
    updated_at: any
}

export interface Contributiontier {
    id: number;
    contributiontier: string;
    totalstudent: number;
}

export interface ContributionCollege {
    id: number;
    institutename: string;
}

export interface StudentUserRes {
    success: boolean
    data: StudentUser[]
}

export interface StudentUser {
    name: string
    id: number
}