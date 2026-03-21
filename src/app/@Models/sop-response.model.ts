import {GrammarResponse, PlagResponse} from "./plag.model";

export interface SopDocUploadResponse {
    docId: number;
    document: string;
    letters: number;
    stage: number;
    sentenses: number;
    words: number
    positive: any[];
    negative: string[];
    Plagiarism: PlagResponse;
    grammer: GrammarResponse;
}

export interface PlagCheckResponse {
    Plagiarism: PlagResponse;
    grammer: GrammarResponse;
}

export interface Country {
    positive: any[];
    negative: string[];
}

export interface University {
    positive: string[];
    negative: string[];
}

export interface Course {
    positive: string[];
    negative: string[];
}

export interface VerifyResponse {
    country: Country;
    university: University;
    course: Course;
}

export interface VerifyPlagPayload {
    docId: number;
    data: string;
}

export interface DownloadSop {
    plagiarized?: number;
    unique?: number;
    grammer?: number;
    report?: string;
    sop?: string;
    stage?: number;
}

export interface SOPData {
    docId: number;
    document: string;
    filename: string;
    type: string;
    courseId: any[];
    country: string;
    university: string;
    universityId: number;
    countryId: number;
    words: number;
    unique: number;
    grammer: GrammarResponse;
    Plagiarism: PlagResponse;
    stage: number;
    updated: string;
    created: string;
}
