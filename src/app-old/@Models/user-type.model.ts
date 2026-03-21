export interface UserTypeData {
    success: boolean;
    data: UserType[];
  }
  
  export interface UserType {
    id: number;
    type: string;
    internalUserType?: number;
    status: number;
    created_at?: string;
    updated_at?: string;
  }