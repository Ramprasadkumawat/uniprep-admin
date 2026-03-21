export interface GovernmentFund {
    isChecked: number
    favourite: any
    id: number
    restrict_flag: any
    name: string
    funding_type_name: string
    country: string
    region: string
    website: string
}

export interface GovernmentFundResponse {
    success: boolean
    count: number
    governmentfundings: GovernmentFund[]
    credit_count: string
    favourite_count: number
}

export interface Paginated {
    page: number;
    perpage: number;
}

export interface AddOrUpdateResponse {
    message: string;
    success: boolean;
}