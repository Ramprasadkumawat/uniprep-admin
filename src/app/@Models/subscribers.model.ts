export interface SubscriberData {
  data: Subscriber[];
  success: boolean;
}
export interface SubscriberCountData {
  TotalRevenue: any;
  TotalRecords: number;
  TotalTalentProfile: number;
  TotalIntroCount: number;
  NotVerifiedUsers: number;
  PaidUsers: number;
  VerifiedUsers: number;
  Today: any;
  TotalPercentages: any;
}

export interface Subscriber {
  userid: number;
  username: string;
  useremail: string;
  userphone: string;
  baseplan: string;
  subscription: string;
  validity?: number;
  country: any;
  interestedcountry: string;
  lastdegreepassingyear: string;
  intakeyear: string;
  intakemonth: number;
  programlevel: string;
  gender: string;
  subscriptionstartdate: string;
  Location: string;
  intakemonthname: string;
  gendername: string;
  subscriptionplan: string;
  subscriptionmonth: string;
  creditplanname: string;
  creditplancount: string;
  totalcreditsleft: string;
  remaincreditsleft: string;
  validitydays: string;
  validityhours: string;
  validityminutes: string;
  validityseconds: string;
  domain: string;
  student_uuid: any;
  job_uuid: any;
}
export type SubscriberTransactionData = SubscriberTransaction[]

export interface SubscriberTransaction {
  orderid: number;
  transactiontime: string;
  transactionid: string;
  transactionstatus: string;
  products: string;
  price: string;
}

export interface SubscriberReadProgressionData {
  interestedcountry_id: string;
  data: SubscriberReadProgression;
  totalrecords: number;
}

export interface SubscriberReadProgression {
  "Pre Application": PreApplication;
  "Post Application": PostApplication;
}

export interface PreApplication {
  "Career Prospectus": ModuleData[];
  "Document Checkist": [];
  "Admission Requirements": ModuleData[];
  "Scholarships": ModuleData[];
  "University Initial Deposit": ModuleData[];
  "Education Loan": ModuleData[];
}

export interface PostApplication {
  "Offer Letter": ModuleData[];
  "Credibility Interview": ModuleData[];
  "University Initial Deposit": ModuleData[];
}

export interface ModuleData {
  progression: string;
  remainingques: number;
  startedtimestamp: string;
  completedtimestamp: string;
  totalduration: string;
  completionstatus: string;
}

export interface QuizProgressionData {
  interestedcountry: number;
  data: QuizProgression[];
  totalcount: number;
}

export interface QuizProgression {
  totalquestions: number;
  module_id: number;
  module_name: string;
  allquestion: number;
  incorrect: number;
  lastattempt: string;
  status: string;
  completestatus: string;
}

export type SourceTypes = SourceType[];

export interface SourceType {
  id: number;
  name: string;
  state: string;
}

export interface ResponseSuccessMessage {
  status: string;
  message: string;
}

export interface ExportData {
  link: string
}