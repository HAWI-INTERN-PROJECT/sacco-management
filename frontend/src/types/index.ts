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
  name: string
  email: string
  username: string
  password: string
  password_confirmation: string
  remember_me?: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
