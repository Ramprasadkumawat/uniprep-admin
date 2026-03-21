export type CountryData = Country[];

export interface Country {
    id: number
    country: string
    altname?: string
    flag: string
    status: number
    created_at: string
    updated_at: string
}

export interface Countries {
    id: number
    country_name: string
}

export interface State {
    id: number
    state_name: string
}

export interface City {
    id: number
    city_name: string
}

export interface CityState {
    id: number
    country_id: number
    city_state: string
}