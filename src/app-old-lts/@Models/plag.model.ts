export interface Source {
    link: string;
    count: number;
    percent: number;
}

export interface Display {
    url: string;
    des: string;
    query: string;
}

export interface Detail {
    query: string;
    version: number;
    unique: string;
    display: Display;
    excludeByUrl: boolean;
    paraphrase: string;
}

export interface PlagResponse {
    isQueriesFinished: string;
    sources: Source[];
    totalQueries: number;
    plagPercent: number;
    paraphrasePercent: number;
    uniquePercent: number;
    excludeURL?: any;
    details: Detail[];
    error?: any;
}
export interface GrammarResponse {
    status: boolean;
    response: {
        result: boolean;
        errors: any[];
    }
}