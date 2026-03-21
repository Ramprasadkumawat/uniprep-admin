export interface LandingPage {
  landingPages: any
  id: number;
  slug: string;
  feature_name: string;
  feature_urlslug: string;
  category: number;
  tag: string;
  status: number;
  icon: string;
  order_no: number;
  description: string;
  created_at: string;
  updated_at: string;
  chooseuses: Chooseuse[];
  whoitsfors: Whoitsfor[];
  faqs: Faq[];
  herocover: Herocover;
  howitsworks: Howitswork[];
  seo: Seo;
  category_name?: string;
  status_name?: string;
  }
  
  export interface Chooseuse {
    id: number
    landingpage_id: number
    chooseus_icon: string
    chooseus_title: string
    chooseus_subtitle: string
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface Whoitsfor {
    id: number
    landingpage_id: number
    itsfor_title: string
    itsfor_subtitle: string
    itsfor_cardimage: any
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface Faq {
    id: number
    landingpage_id: number
    question: string
    answer: string
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface Herocover {
    id: number
    landingpage_id: number
    hero_title: string
    video_link: any
    hero_description: string
    hero_coverimage: any
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface Howitswork {
    id: number
    landingpage_id: number
    step: number
    itswork_title: string
    itswork_subtitle: string
    itswork_cardimage: any
    feature_image: any
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface Seo {
    id: number
    landingpage_id: number
    seo_title: string
    meta_description: string
    meta_tag: any
    meta_author: any
    seo_status: number
    image: any
    created_at: string
    updated_at: string
  }
  
export interface Category {
  id?: string;
  category_name: string;
  page_title: string;
  page_description: string;
  status: number;

  seo?: {
    seo_title: string;
    meta_description: string;
    meta_tag?: string;
    meta_author?: string;
    seo_status: number;
    image?: string;
  };

  category_info?: {
    category_title: string;
    category_icon: string;
    category_description: string;
  };

  category_cards?: Array<{
    id?: number;
    icon_emoji: string;
    title: string;
    sub_title: string;
  }>;
}