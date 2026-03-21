export interface CreditData {
    success: boolean;
    questioncredits: Credit[];
  }
  
  export interface Credit {
    id: number;
    name: string;
    price: string;
    discount_type: string;
    discount: string;
    questions_count?: number;
    status: number;
    created_at: string;
    updated_at: string;
  }