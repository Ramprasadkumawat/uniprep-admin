export interface Company {
  id: number;
  company_name: string;
  company_logo: string;
  founded_year: string;
  website: string;
  linkedin_link: string;
  type: string;
  size: string;
  industry_type: string;
  HQ_city: string;
  HQ_country: string;
  percentage_completed: number;
  departments: string;
  work_mode: string;
  verified: any;
  jobs: number;
  industry_type_card_view: string[];
  talent_connect: number;
  selected?: boolean;
}