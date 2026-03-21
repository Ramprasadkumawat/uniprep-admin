export interface CountryInsightsPayload {
    country: string;
    url: string;
    image?: string;
}

export interface GetCountryInsightPayload {
    page: number;
    country?: string;
    moduleId?: string;
    perpage: number;
    keyword: string;
}
export interface CountryInsightSuccess {
    success: boolean;
    message: string;
}
export interface CountryInsightResponse {
    data: CountryInsightCategory[];
    count: number;
    success: boolean;
}
export interface CountryInsightCategory {
    id: number;
    icon: string;
    urlslug: string;
    submodule_name: string;
    CountryInsight_category_type_id: number;
    category_name: string;
}
export interface getCountryInsightQuizQuestionPayload {
    module_id: string;
    page: number;
    perpage: number;
    country: string
}

export interface CountryInsightQuizQuestionPayload {
    title: string;
    image?: string;
    answer: string;
    id: string;
    module_id?: string;
    country_id: string;
}

export interface CountryInsightQuizQuestionsSuccess {
    success: boolean;
    questions: CountryInsightsQuestionList[];
    count: number
}

export interface CountryInsightQuizQuestionsAddSuccess {
    status: boolean;
    message: string;
}
export interface Stream {
    id: number;
    category_type: string;
    name: string;
    selected?: boolean;
}


export interface GetCountryInsightToolCategoryPayload {
    module_id: string;
    submoduleId?: string;
    page: number;
    perpage: number;
    countryId: string;
}

export interface AddCountryInsightToolCategoryPayload {
    module_id: string;
    submodule_id: string;
    page: number;
    perpage: number;
}

export interface CountryInsightsQuestionList {
    id: number
    countryinsight_id: number
    country: number
    title: string
    image: string
    answer: string
    status: number
    created_at: string
    updated_at: string;
    module_name: string;
}