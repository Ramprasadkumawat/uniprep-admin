export interface PreApplicationParams {
  submoduleName: string;
  urlslug: string;
  image: string;
  countries: string;
}
export interface PreApplication {
  success: boolean;
  questions: Question[];
}

export interface Question {
  id: number;
  country_id: number;
  module_id: number;
  submodule_id: number;
  question: string;
  answer: string;
  videolink: any
  reflink: any
  imagelink: any;
  reviewed: number;
  popular: number;
  favourite: number;
  verified: any
  pre_verified: any
  formatted: any
  edited: any
  tags: string;
  status: number;
  created_at: string;
  updated_at: string;
  read: number;
  homecountry:number;
  category:number;
}

export interface SubModuleData {
  success: boolean;
  submodulecount: SubModule[];
}

export interface SubModule {
  id: number;
  submodule_name: string;
  icon: string;
  countries: string;
  urlslug?: string;
  status: number;
  created_at: any
  updated_at?: string;
  questioncount: number;
  nonreviewed: number;
  nonformatted: number;
  nonactioned: number;
}

export interface ResponseReadingData {
  success: boolean;
  message: string;
}
export interface ResponseImportData {
  record_details:{
    Total_Records:number,
    Total_Uploaded:number,
    Total_Not_Uploaded:number,
    Not_Uploaded_Link:string
  }
  message: string;
}

export type QuestionHistoryData = QuestionHistory[];

export interface QuestionHistory {
  action: string;
  fieldname: string;
  old_value: string;
  new_value: string;
  username: string;
  date: string;
  serial_no: number;
}

export interface SuggestedQuestionData {
  totalsuggestions: number;
  data: SuggestedQuestion[];
}

export interface SuggestedQuestion {
  user_id: number;
  name: string;
  email: string;
  questioncount: number;
  logo: string;
}

export type SuggestedQuestionAndAnswerData = SuggestedQuestionAndAnswer[];

export interface SuggestedQuestionAndAnswer {
  user_id: number;
  email: string;
  name: string;
  module_name: string;
  table_name: string;
  question: string;
  answer: string;
  video_link: string;
  image_link: string;
  created_at: string;
  logo: string;
  submodule_name: string;
}