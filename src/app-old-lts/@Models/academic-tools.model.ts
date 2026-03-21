export interface AcademicPayload {
    submodulename: string;
    urlslug: string;
    image?: string;
    moduleId?: string;
    category_id: string;
    submoduleId:string;
}

export interface GetAcademicPayload {
    module_id: string;
    page: number;
    perpage: number;
}
export interface AcademicCategorySuccess {
    success: boolean;
    message: string;
}
export interface AcademicResponse {
    data: AcademicCategory[];
    count: number;
    success: boolean;
}
export interface AcademicCategory {
    id: number;
    icon: string;
    urlslug: string;
    submodule_name: string;
    academic_category_type_id: number;
    category_name: string;
}
export interface getAcademicQuizQuestionPayload {
    module_id: string;
    page: number;
    perpage: number;
    submodule_id: string;
}

export interface AcademicQuizQuestionPayload {
    module_id: string;
    question_id?: number;
    submodule_id: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: string;
    summary: string;
    status: string;
}
export interface AcademicQuizQuestionsSuccess {
    success: boolean;
    questions: AcademicQuestion[];
    count: number
}

export interface AcademicQuizQuestionsAddSuccess {
    status: boolean;
    message: string;
}
export interface Stream {
    id: number;
    category_type: string;
    name: string;
    selected?: boolean;
}

export interface StreamQuestionPayload {
    module_id: string;
    submodule_id: string;
    question: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    option5: string;
    option6: string;
    option1_type_id: number;
    option2_type_id: number;
    option3_type_id: number;
    option4_type_id: number;
    option5_type_id: number;
    option6_type_id: number;
    answer: string;
    questions_id: string;
    status?: string;
    summary?: string
}
export interface AcademicQuestion {
    id: number;
    module_id: number;
    submodule_id: number;
    question: string;
    option1: string;
    option1_type_id?: number;
    option2: string;
    option2_type_id?: number;
    option3: string;
    option3_type_id?: number;
    option4: string;
    option4_type_id?: number;
    option5?: string;
    option5_type_id?: number;
    option6?: string;
    option6_type_id?: number;
    answer?: any;
    summary?: any;
    status: number;
    created_at: string;
    updated_at: string;
}
export interface GetAcademicToolCategoryPayload {
    module_id:string;
    submoduleId?: string;
    page: number;
    perpage: number;
}

export interface AddAcademicToolCategoryPayload {
    module_id:string;
    submodule_id: string;
    page: number;
    perpage: number;
}