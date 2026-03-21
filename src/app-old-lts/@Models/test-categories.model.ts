export interface GetCategoriesPayload {
    moduleId: string;
    page: number;
    perpage: number;
}
export interface CategoryResponse {
    data: CategoriesList[];
    count: number;
}

export interface CategoriesList {
    category: string;
    icon: string;
    id: number;
    url_slug: string;
}

export interface AddCategoryPayload {
    categoryname: string;
    urlslug: string;
    image: string;
    moduleId: string;
}
export interface CategorySuccess {
    success: boolean;
    message: string;
}

export interface UpdateCategoryPayload {
    categoryname: string;
    urlslug: string;
    image: string;
}
export interface AddQuizPayload {
    category_id: string;
    submodulename: string;
    urlslug: string;
    image: string;
    moduleId: string;
    level?: number;
}
export interface GetQuizPayload {
    categoryId: string;
    page: number;
    perpage: number;
}
export interface QuizResponse {
    data: Quiz[];
    count: number;
}
export interface Quiz {
    id: number;
    icon: string;
    urlslug: string;
    submodule_name: string;
    level?: number;
    type?: number;
}
export interface UpdateQuizPayload {
    submodulename: string;
    urlslug: string;
    image: string;
    level?: number;
}
export interface GetSubcategoryPayload {
    categoryId: string;
    moduleId: string;
    page: number;
    perpage: number;
}
export interface AddSubCategoryPayload {
    categoryname: string;
    urlslug: string;
    image: string;
    moduleId: string;
    parent_category_id: string;
}
export interface SubCategoryResponse {
    data: SubCategoriesList[];
    count: number;
}
export interface SubCategoriesList {
    category: string;
    icon: string;
    url_slug: string;
    parent_category_id: number;
    sub_category_id: number;
}
export interface UpdateSubCategoryPayload {
    categoryname: string;
    urlslug: string;
    image: string;
}
export interface getQuizQuestionPayload {
    moduleId: string;
    countryId: number;
    page: number;
    perpage: number;
    submoduleId: string;
}
export interface AddQuizQuestionPayload {
    moduleId: string;
    countryId: number;
    page: number;
    perpage: number;
    submoduleId: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: string;
    source_summary: string;
}
export interface UpdateQuizQuestionPayload {
    moduleId: string;
    question_id: number;
    countryId: number;
    page: number;
    perpage: number;
    submoduleId: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: string;
    source_summary: string;

}
export interface QuizQuestionsSuccess {
    success: boolean;
    questions: question[];
    count: number
}
export interface question {
    id: number;
    country_id: number;
    module_id: number;
    submodule_id: number;
    language_id?: any;
    languagetype?: any;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: number;
    source_faqquestion: string;
    source_summary: string;
    status: number;
    created_at: string;
    updated_at: string;
}
export interface QuizQuestionsAddSuccess {
    status: boolean;
    message: string;
}