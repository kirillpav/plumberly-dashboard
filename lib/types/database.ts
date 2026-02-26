export type UserRole = "customer" | "plumber";

export type PlumberStatus = "provisional" | "active" | "frozen" | "suspended";

export type ServicesType = "gas" | "no_gas";

export type EnquiryStatus =
  | "new"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export type JobStatus =
  | "pending"
  | "quoted"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_admin: boolean;
  created_at: string;
}

export interface PlumberDetails {
  id: string;
  user_id: string;
  regions: string[];
  hourly_rate: number;
  bio: string | null;
  verified: boolean;
  rating: number;
  jobs_completed: number;
  business_name: string;
  services_type: ServicesType;
  gas_safe_number: string | null;
  gas_safe_verified: boolean;
  consent_to_checks: boolean;
  right_to_work: string | null;
  status: PlumberStatus;
  provisional_jobs_remaining: number;
  payouts_enabled: boolean;
  frozen_reason: string | null;
}

export interface PlumberWithProfile extends PlumberDetails {
  profiles: Profile;
}

export interface Enquiry {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  status: EnquiryStatus;
  region: string | null;
  preferred_date: string | null;
  preferred_time: string[];
  images: string[];
  chatbot_transcript: unknown;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  enquiry_id: string;
  customer_id: string;
  plumber_id: string;
  status: JobStatus;
  quote_amount: number | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  notes: string | null;
  quote_description: string | null;
  customer_confirmed: boolean;
  plumber_confirmed: boolean;
  verification_pin: string | null;
  pin_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobWithRelations extends Job {
  customer: Profile;
  plumber: Profile;
  enquiries: Enquiry;
}

export interface Review {
  id: string;
  job_id: string;
  customer_id: string;
  plumber_id: string;
  rating: number;
  comment: string | null;
  flagged: boolean;
  created_at: string;
}

export interface ReviewWithProfiles extends Review {
  customer: Profile;
  plumber: Profile;
}
