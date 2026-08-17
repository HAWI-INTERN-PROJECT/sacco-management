export interface User {
  id: number
  name: string
  email: string
  username: string
  role?: string
  sacco_id?: number | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  access_token: string
  token_type: string
  expires_at: string
}

export interface LoginRequest {
  login: string
  password: string
  remember_me?: boolean
}

export interface RegisterRequest {
  sacco_name: string
  registration_number: string
  admin_name: string
  admin_email: string
  admin_username: string
  password: string
  password_confirmation: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface Sacco {
  id: number
  name: string
  registration_number: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string | null
  members_count?: number
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_saccos: number
  approved_saccos: number
  pending_saccos: number
  rejected_saccos: number
  total_members: number
  total_savings: number
  total_active_loans: number
}

export interface SaccoAdministrator {
  id: number
  name: string
  email: string
  username: string
}

export interface ExtendedSaccoDetails {
  sacco: Sacco
  administrator: SaccoAdministrator | null
  total_savings: number
  active_loans_count: number
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  links?: PaginationLinks
  meta?: PaginationMeta
}

