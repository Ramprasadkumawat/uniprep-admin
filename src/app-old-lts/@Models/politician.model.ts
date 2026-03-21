export interface Politician {
    isChecked: number
    id: number
    name: string
    linkedin_id: string
    description: string
    country: string
    flag: string
    occupation: string,
    imageUrl: string
}

export interface ObjectModel {
    [key: string]: any
}