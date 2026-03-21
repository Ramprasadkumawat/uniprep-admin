export interface StudentRemarksRes {
    count: number
    remarks: StudentRemark[]
  }
  
  export interface StudentRemark {
    id: number
    remark_status?: string
    next_follow_up?: number
    next_follow_up_date: string
    name?: string
    comments: string
    status: number
    created_at: string
    RNR?: number
  }