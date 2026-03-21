interface Language {
    id: number;
    student_id: number;
    proficiency: string;
    hobby_id: number;
    status: number;
    language_name: string;
  }
  
  // Education Interface
  interface Education {
    id: number;
    student_id: number;
    university_name: string;
    course_name: string;
    graduation_year_id: number;
    gpa_percentage: string;
    created_at: string;
    updated_at: string;
    qualification_name: string;
    field_of_study: string | null;
    graduation_year_name: string;
  }
  
  // Certification Interface
  interface Certification {
    id: number;
    student_id: number;
    name: string | null;
    file_name: string | null;
    type: string;
    status: number;
  }
  
  // Reference Interface
  interface Reference {
    id: number;
    student_id: number;
    college_name: string | null;
    reference_name: string | null;
    designation: string | null;
    phone_number: string | null;
    email: string | null;
  }
  
  // Work Experience Interface
  interface WorkExperience {
    id: number;
    student_id: number;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date: string | null;
    description: string;
    is_current: boolean;
  }
  
  // Career Preference Interface
  interface CareerPreference {
    id: number;
    student_id: number;
    career_status: string;
    preferred_employment_type: string[]; // JSON string of array
    preferred_workplace_type: string[]; // JSON string of array
    willingness_to_relocate: string;
    currency_id: number;
    expected_salary: string;
    set_industry_apart: string | null;
    real_world_challenge: string | null;
    leadership_experience: string | null;
    admired_quality: string | null;
    cv_filename: string | null;
    portfolio_upload_link: string | null;
    video_link: string | null;
    notes: string | null;
    preferred_work_location: string[] | null;
    job_title: string | null;
    career_interest_name: string | null;
    soft_skill_name: string | null;
    professional_strength: string | null;
  }
  
  // Main User Profile Interface
 export interface UserProfile {
    id: number;
    user_id: number;
    full_name: string;
    date_of_birth: string;
    gender: string;
    dp_image: string;
    profile_completion: number;
    linkedin_profile: string | null;
    personal_website: string | null;
    total_years_of_experience: string;
    overall_years_experience: string;
    status: number;
    careerPreference: CareerPreference;
    nationality_name: string;
    current_location: string;
    work_experience: WorkExperience[];
    education: Education[];
    certifications: Certification[];
    references: Reference[];
    professional_references: Reference[];
    languages: Language[];
    networking: any[]; // Type is not clear from provided data
   updated_at?: Date;
  }