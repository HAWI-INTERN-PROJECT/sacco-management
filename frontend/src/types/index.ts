export interface User {
  id: number
  name: string
  email: string
  username: string
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
