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

export interface SavingsTransaction {
  id: number
  sacco_id: number
  member_id: number
  type: 'deposit' | 'withdrawal' | 'dividend' | 'fee'
  amount: number
  balance_after: number
  description: string
  reference_number?: string
  recorded_by?: number
  created_at: string
}

export interface Loan {
  id: number
  sacco_id: number
  member_id: number
  loan_number: string
  amount: number
  purpose: string
  interest_rate: number
  term_months: number
  status: 'pending' | 'approved' | 'active' | 'rejected' | 'closed'
  created_at: string
  member?: User
  user?: User
}

export interface LoanSchedule {
  id: number
  loan_id: number
  installment_number: number
  due_date: string
  amount_due: number
  principal_component: number
  interest_component: number
  status: 'pending' | 'paid' | 'overdue'
}

export interface Repayment {
  id: number
  sacco_id: number
  loan_id: number
  loan_schedule_id: number
  member_id: number
  amount: number
  payment_date: string
  payment_method: string
  reference_number: string
  status: 'completed' | 'pending'
}

export interface Dividend {
  id: number
  sacco_id: number
  user_id: number
  period: string
  amount: number
  shares_held: number
  ownership_percentage: number
  status: 'pending' | 'credited'
}

export interface AdminDashboardMetrics {
  total_members: {
    value: number
    change: number
  }
  total_savings: {
    value: number
    change: number
  }
  active_loans: {
    value: number
    outstanding_amount: number
  }
  overdue_repayments: {
    count: number
    amount: number
  }
  share_capital: {
    value: number
    total_shares: number
  }
}
