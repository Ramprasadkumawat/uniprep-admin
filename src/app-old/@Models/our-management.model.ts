export interface TeamMember {
    id?: number
    name: string
    designation: string
    image: string
    linkedin_url: string | null
    status: number
    status_name: string
    created_at?: string
    updated_at?: string
  }