export interface UserData {
  success: boolean;
  userdetails: User[];
}

export interface User {
  id: number;
  email: string;
  email_verified_at: any
  status: number;
  usertype_id: number;
  created_at: string;
  updated_at: any;
  deleted_at: any;
  user_id: number;
  name: string;
  location_id: number;
  phone: string;
  subscription: string;
  subscription_id: number;
  gender: string;
  interested_country_id: string;
  last_degree_passing_year: string;
  programlevel_id: number;
  intake_year_looking: string;
  intake_month_looking: number;
  countries_certificate: string;
  newsletter_consent: number;
  country: any;
  credit_plans: string;
  source_type: any;
  source: any;
  type: string;
  internalUserType: any;
  state: string;
  district: string;
  price: any;
  discount: any;
  validity: any;
  discount_percentage: any;
  description: any;
  subscription_url_slug: any;
  totalcredits: any;
  programlevel: string;
  review_org_country:any;
}

export interface UserPaginatedresponse {
  data: User[];
  per_page: number;
  total: number;
}

export interface UserType {
  id: number;
  name: string;
}

export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  usertype:number;
  gender:string;
  region:string;
  location:string;
  source?: number;
  designation?:string;
  userId?: any;
  demo_user:number;
};

export interface LoadUserParams {
  page: number, name?: string; email?: string; phone?: string; usertype?: any
};

export interface UsersData {
  success: boolean;
  users: Users[];
  count: number;
}

export interface Users {
  id: number;
  email: string;
  email_verified_at: any;
  status: number;
  user_type_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  user_id: number;
  name: string;
  location_id: number;
  phone: string;
  subscription: number;
  subscription_id: number;
  gender: string;
  interested_country_id: string;
  last_degree_passing_year: string;
  programlevel_id: number;
  intake_year_looking: string;
  intake_month_looking: number;
  countries_certificate?: string;
  newsletter_consent: number;
  country?: string;
  credit_plans: string;
  source_type?: number;
  source?: any;
  region:string;
  location:string;
  designation?:string;
  demoUser:number;
  dial_country_code?:string;
}

export interface UserResponse {
  status: string;
  message: string;
}
